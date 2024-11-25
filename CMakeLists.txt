cmake_minimum_required(VERSION 3.25)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

project(bare_log C)

fetch_package("github:holepunchto/liblog#a40c28a")

add_bare_module(bare_logger)

target_sources(
  ${bare_logger}
  PRIVATE
    binding.c
)

target_link_libraries(
  ${bare_logger}
  PRIVATE
    $<TARGET_OBJECTS:log>
  PUBLIC
    log
)
