# To deal with pdf files
import hashlib

DEFAULT_INFO = {
    'type': 'article',
    'author': '',
    'title': '',
    'journal_or_booktitle': '',
    'year': ''
}


def get_pdf_md5_hash(pdf):
    blocksize = 65536
    hasher = hashlib.md5()

    buf = pdf.chunks(chunk_size=blocksize)
    while len(buf) > 0:
        hasher.update(buf)
        buf = pdf.chunks(chunk_size=blocksize)

    return hasher.hexdigest()


def get_default_info(pdf_upload):
    info = DEFAULT_INFO
    # TODO: extract pdf to get default info
    info['title'] = pdf_upload.name

    return info
