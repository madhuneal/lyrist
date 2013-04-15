#!/bin/bash

# Lyrist
# (c) 2013 Sahil Bajaj. Released under the MIT License.
#
# lyrist.sh

osascript lyrist.scpt | node lyrist.js | less -RX