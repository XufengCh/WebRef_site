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
    hasher = hashlib.md5()

    for chunk in pdf.chunks():
        hasher.update(chunk)

    return hasher.hexdigest()


def get_default_info(pdf_upload):
    info = DEFAULT_INFO
    # TODO: extract pdf to get default info
    info['title'] = pdf_upload.name[:-4]

    return info
