import re

_PATTERNS = [
    ("SSN",   re.compile(r'\b\d{3}-\d{2}-\d{4}\b')),
    ("EMAIL", re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')),
    ("PHONE", re.compile(r'\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')),
    ("ACCT",  re.compile(r'\*{4}\d{4}|\b\d{15,16}\b')),
]

def maskCsv(csv_text: str) -> tuple[str, dict]:
    """Strip PII from a CSV string. Returns (masked_csv, uid_to_original lookup)."""
    lookup: dict[str, str] = {}
    reverse: dict[str, str] = {}
    counters: dict[str, int] = {}

    def replace(prefix: str, original: str) -> str:
        if original in reverse:
            return reverse[original]
        n = counters.get(prefix, 0) + 1
        counters[prefix] = n
        uid = f"{prefix}_{n:03d}"
        lookup[uid] = original
        reverse[original] = uid
        return uid

    result = csv_text
    for prefix, pattern in _PATTERNS:
        result = pattern.sub(lambda m, p=prefix: replace(p, m.group(0)), result)

    return result, lookup

def demask(text: str, lookup: dict) -> str:
    """Restore original PII values in a response string."""
    for uid, original in lookup.items():
        text = text.replace(uid, original)
    return text
