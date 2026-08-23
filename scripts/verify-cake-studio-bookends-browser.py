#!/usr/bin/env python3
"""Compatibility entry point for the strict Cake Studio v1.8 browser gate."""

from __future__ import annotations

import runpy
from pathlib import Path


if __name__ == "__main__":
    gate = Path(__file__).with_name("verify-cake-studio-v17-browser-ready.py")
    runpy.run_path(str(gate), run_name="__main__")
