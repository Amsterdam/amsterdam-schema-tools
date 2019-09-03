import glob
import os
import logging

import objectstore

SCHEMAS_CONTAINER = 'schemas'

log = logging.getLogger('objectstore')

ENVIRONMENT = os.getenv('environment', 'ACC').lower()
OBJECTSTORE_PASSWORD_ENV_KEY = 'CMS_OBJECTSTORE_PASSWORD'

assert os.getenv(OBJECTSTORE_PASSWORD_ENV_KEY)

OBJECTSTORE = dict(
    VERSION='2.0',
    AUTHURL='https://identity.stack.cloudvps.com/v2.0',
    TENANT_NAME='BGE000081 CMS',
    TENANT_ID='8cf50dff44f54b5a9d59d5b77fe672b3',
    USER=os.getenv('OBJECTSTORE_USER', 'cms_objectstore'),
    PASSWORD=os.getenv(OBJECTSTORE_PASSWORD_ENV_KEY),
    REGION_NAME='NL',
)


logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("swiftclient").setLevel(logging.WARNING)


_conn = objectstore.get_connection(OBJECTSTORE)


def _files_in_source_dir(dir):
    return list(filter(lambda f: os.path.isfile(f), glob.glob(f'{dir}/**', recursive=True)))


if __name__ == "__main__":
    file_list = objectstore.get_full_container_list(_conn, SCHEMAS_CONTAINER, prefix=ENVIRONMENT + "/")
    last_modified = max([item['last_modified'] for item in file_list])

    source_dir = os.path.dirname(os.path.realpath(__file__)) + "/target"
    files = _files_in_source_dir(source_dir)
    for file in files:
        target_name = file.replace(source_dir, ENVIRONMENT)
        with open(file, 'rb') as fileobject:
            objectstore.put_object(_conn, SCHEMAS_CONTAINER, target_name, fileobject, content_type='application/json')

    file_list = objectstore.get_full_container_list(_conn, SCHEMAS_CONTAINER, prefix=ENVIRONMENT + "/")
    for file in file_list:
        if last_modified >= file['last_modified']:
            objectstore.delete_object(_conn, SCHEMAS_CONTAINER, file)
