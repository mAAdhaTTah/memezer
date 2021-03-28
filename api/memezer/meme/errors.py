from uuid import UUID


class DuplicateFilenameException(Exception):
    def __init__(self, filename: str):
        self.filename = filename


class MemeNotFound(Exception):
    def __init__(self, meme_id: UUID):
        self.meme_id = meme_id
