cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)

project(bare_log C)

add_bare_module(bare_logger)

target_sources(
  ${bare_logger}
  PRIVATE
    binding.c
)
