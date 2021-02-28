class DuplicateFilenameException(Exception):
    def __init__(self, filename: str):
        self.filename = filename
