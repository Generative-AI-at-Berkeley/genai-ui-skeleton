"""Fail the build when prose in this repo reads like it was generated.

The rules come from AGENTS.md. This only catches the mechanical tells. A human
still has to catch the rest.

Run with: pnpm lint:content
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Final

REPO_ROOT: Final = Path(__file__).resolve().parent.parent

SCANNED_SUFFIXES: Final[frozenset[str]] = frozenset(
    {".py", ".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".yml", ".yaml"}
)

SKIPPED_DIRECTORIES: Final[frozenset[str]] = frozenset(
    {
        ".git",
        ".next",
        ".mypy_cache",
        ".pytest_cache",
        ".ruff_cache",
        ".venv",
        "__pycache__",
        "node_modules",
        "styled-system",
        "dist",
        "build",
    }
)

# This file necessarily contains every banned token, AGENTS.md documents them, and the
# lockfile is generated.
SKIPPED_FILES: Final[frozenset[str]] = frozenset({"lint_content.py", "AGENTS.md", "pnpm-lock.yaml"})

BANNED_CHARACTERS: Final[dict[str, str]] = {
    "—": "em dash, use a period and a new sentence",
    "–": "en dash, use 'to' for ranges",
    "…": "ellipsis character, use three periods",
    "“": "curly quote, use a straight quote",
    "”": "curly quote, use a straight quote",
    "‘": "curly quote, use a straight quote",
    "’": "curly apostrophe, use a straight apostrophe",
}

BANNED_WORDS: Final[tuple[str, ...]] = (
    "leverage",
    "leverages",
    "leveraging",
    "utilize",
    "utilizes",
    "utilizing",
    "seamless",
    "seamlessly",
    "robust",
    "delve",
    "delves",
    "unlock",
    "unlocks",
    "elevate",
    "elevates",
    "streamline",
    "streamlines",
    "empower",
    "empowers",
    "harness",
    "harnesses",
    "realm",
    "tapestry",
    "testament",
    "cutting-edge",
    "state-of-the-art",
    "game-changer",
    "revolutionize",
    "revolutionizes",
    "supercharge",
    "supercharges",
    "effortless",
    "effortlessly",
)

BANNED_PHRASES: Final[tuple[str, ...]] = (
    "dive in",
    "dive into",
    "let's dive",
    "in today's",
    "whether you're",
    "at its core",
    "simply put",
    "it's worth noting",
    "worth noting that",
    "needless to say",
)

WORD_PATTERN: Final = re.compile(
    r"\b(" + "|".join(re.escape(word) for word in BANNED_WORDS) + r")\b",
    re.IGNORECASE,
)

PHRASE_PATTERN: Final = re.compile(
    "|".join(re.escape(phrase) for phrase in BANNED_PHRASES),
    re.IGNORECASE,
)


@dataclass(frozen=True, slots=True)
class Violation:
    path: Path
    line_number: int
    column: int
    found: str
    reason: str

    def render(self) -> str:
        location = f"{self.path.relative_to(REPO_ROOT)}:{self.line_number}:{self.column}"
        return f"{location}  {self.found!r}  {self.reason}"


def is_scanned(path: Path) -> bool:
    if path.suffix not in SCANNED_SUFFIXES:
        return False
    if path.name in SKIPPED_FILES:
        return False
    return not any(part in SKIPPED_DIRECTORIES for part in path.parts)


def scan_line(path: Path, line_number: int, line: str) -> list[Violation]:
    violations: list[Violation] = []

    for character, reason in BANNED_CHARACTERS.items():
        column = line.find(character)
        if column != -1:
            violations.append(Violation(path, line_number, column + 1, character, reason))

    for match in WORD_PATTERN.finditer(line):
        violations.append(
            Violation(path, line_number, match.start() + 1, match.group(), "banned word")
        )

    for match in PHRASE_PATTERN.finditer(line):
        violations.append(
            Violation(path, line_number, match.start() + 1, match.group(), "banned phrase")
        )

    return violations


def scan_repository(root: Path) -> list[Violation]:
    violations: list[Violation] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or not is_scanned(path):
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for line_number, line in enumerate(content.splitlines(), start=1):
            violations.extend(scan_line(path, line_number, line))
    return violations


def main() -> int:
    violations = scan_repository(REPO_ROOT)
    if not violations:
        print("content lint passed")
        return 0

    print(f"content lint failed with {len(violations)} violation(s):\n")
    for violation in violations:
        print(f"  {violation.render()}")
    print("\nRules live in AGENTS.md section 1.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
