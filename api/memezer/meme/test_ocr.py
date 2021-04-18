from pathlib import Path

from .ocr import ocr


def test_recognize_goodpun(goodpun_path: Path) -> None:
    results = ocr.recognize(goodpun_path)

    assert (
        results
        == """BA pupster2

The two faces of a good pun."""
    )
