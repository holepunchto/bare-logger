#include <assert.h>
#include <bare.h>
#include <js.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <utf.h>
#include <uv.h>

#ifndef _WIN32
#include <poll.h>
#endif

static bool
bare_logger__check_string(js_env_t *env, js_value_t *value) {
  int err;

  bool is_string;
  err = js_is_string(env, value, &is_string);
  assert(err == 0);

  if (!is_string) {
    err = js_throw_type_error(env, NULL, "Data must be a string");
    assert(err == 0);
  }

  return is_string;
}

static void
bare_logger__write_all(int fd, const char *data, size_t len) {
  int res;

  uv_fs_t req;

  while (len > 0) {
    uv_buf_t buf = uv_buf_init((char *) data, (unsigned int) len);

    res = uv_fs_write(NULL, &req, fd, &buf, 1, -1, NULL);

    uv_fs_req_cleanup(&req);

    if (res == UV_EINTR) continue;

#ifndef _WIN32
    if (res == UV_EAGAIN) {
      struct pollfd pfd = {.fd = fd, .events = POLLOUT};

      poll(&pfd, 1, -1);

      continue;
    }
#endif

    if (res < 0) return;

    data += res;
    len -= (size_t) res;
  }
}

static bool
bare_logger__write(js_env_t *env, js_callback_info_t *info, int fd) {
  int err;

  js_value_t *argv[1];
  size_t argc = 1;

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  if (argc < 1) {
    err = js_throw_type_errorf(env, NULL, "Expected 1 argument, got %zu", argc);
    assert(err == 0);

    return false;
  }

  if (!bare_logger__check_string(env, argv[0])) return false;

  size_t len;
  err = js_get_value_string_utf8(env, argv[0], NULL, 0, &len);
  assert(err == 0);

  utf8_t *data = malloc(len + 1 /* NULL */);

  if (data == NULL) {
    err = js_throw_error(env, uv_err_name(UV_ENOMEM), uv_strerror(UV_ENOMEM));
    assert(err == 0);

    return false;
  }

  err = js_get_value_string_utf8(env, argv[0], data, len + 1, &len);
  assert(err == 0);

  data[len] = '\n';

  bare_logger__write_all(fd, (const char *) data, len + 1);

  free(data);

  return true;
}

static js_value_t *
bare_logger_debug(js_env_t *env, js_callback_info_t *info) {
  bare_logger__write(env, info, fileno(stdout));

  return NULL;
}

static js_value_t *
bare_logger_info(js_env_t *env, js_callback_info_t *info) {
  bare_logger__write(env, info, fileno(stdout));

  return NULL;
}

static js_value_t *
bare_logger_warn(js_env_t *env, js_callback_info_t *info) {
  bare_logger__write(env, info, fileno(stderr));

  return NULL;
}

static js_value_t *
bare_logger_error(js_env_t *env, js_callback_info_t *info) {
  bare_logger__write(env, info, fileno(stderr));

  return NULL;
}

static js_value_t *
bare_logger_fatal(js_env_t *env, js_callback_info_t *info) {
  if (!bare_logger__write(env, info, fileno(stderr))) return NULL;

  // The record has already been flushed, so terminate without running atexit
  // handlers and static destructors, which other threads may still be executing
  // JavaScript against.
  _Exit(1);

  return NULL;
}

static js_value_t *
bare_logger_exports(js_env_t *env, js_value_t *exports) {
  int err;

#define V(name, fn) \
  { \
    js_value_t *val; \
    err = js_create_function(env, name, -1, fn, NULL, &val); \
    assert(err == 0); \
    err = js_set_named_property(env, exports, name, val); \
    assert(err == 0); \
  }

  V("debug", bare_logger_debug)
  V("info", bare_logger_info)
  V("warn", bare_logger_warn)
  V("error", bare_logger_error)
  V("fatal", bare_logger_fatal)
#undef V

#define V(name, bool) \
  { \
    js_value_t *val; \
    err = js_get_boolean(env, bool, &val); \
    assert(err == 0); \
    err = js_set_named_property(env, exports, name, val); \
    assert(err == 0); \
  }

  V("isTTY", uv_guess_handle(1) == UV_TTY && uv_guess_handle(2) == UV_TTY);
#undef V

  return exports;
}

BARE_MODULE(bare_logger, bare_logger_exports)
