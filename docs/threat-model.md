# Threat model

## What this is

`bare-logger` is compiled into Bare. It is listed in `src/builtins.json`, so every Bare process has it. That holds whether or not the process sealed, and no code has to load anything to reach it.

So this addon is part of Bare, and [Bare's threat model](https://github.com/holepunchto/bare/blob/main/docs/threat-model.md) covers it. Read that one first. This one only says where this addon sits in it.

## What it inherits

- **The promise.** Bare promises a sealed process gets no new native code. This addon is native code that is already in, so the seal neither adds it nor takes it away.
- **The attacker.** Untrusted JavaScript in a sealed process. It writes what it likes, runs on as many threads as it wants, and calls anything it can reach in any order and all at once. It can reach all of this addon.
- **The trust.** This addon is trusted, because Bare compiles it in. Whatever you compile in is your security policy, and this is one of the things you picked.
- **The walls.** The same table applies. A thread is not a wall and neither is a realm, so nothing here gets to assume it is alone.
- **The rules.** What Bare says to report, and what Bare says is not a bug, is the same here.

## What counts

- **Counts:** `binding.c` and the JavaScript that ships with it. Sealed JavaScript reaches all of it without loading a thing.
- **Does not count:** tests, benchmarks, and scratch code.

## What this addon adds

Writes to `stdout` and `stderr`, and a flag saying whether both are a TTY.

Bare's document lists writing to `stdout` and `stderr` under what still works after the seal. This addon is how, and `console` goes through it in a default build.

It writes to the two descriptors the process was given. It opens nothing, so it is not a way to reach the filesystem. Pointing them somewhere else is the embedder's job, and it happens before Bare starts.

## Where the risk is

Whatever sealed code writes goes wherever those two descriptors go, so treat them as a way out of the process. If the far end is a file, a pipe or a device log, sealed code can put any bytes it likes into it. If the far end is a terminal, that includes escape sequences.

The C formats strings that JavaScript picked and turns them into UTF-8.

## What to report

- Memory bugs in `binding.c` that JavaScript can reach, above all in formatting and UTF-8 conversion
- Any way to reach a descriptor other than `stdout` and `stderr`
- Anything on Bare's report list

Not a bug: that sealed code can write to `stdout` and `stderr`. Bare grants that, and only the OS can take it back.
