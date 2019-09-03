import glob
import json
import os

from jsonschema import Draft7Validator, RefResolver

ROOT_URL = "https://ams-schema.glitch.me/"

WORKING_DIR = '/target'
DATASET_WORKING_DIR = '/target/dataset'
CORE_SCHEMA = '/core/schema'


def _files_in_working_dir(pwd):
    return list(filter(lambda f: os.path.isfile(f), glob.glob(f'{pwd}/**', recursive=True)))


def _check_and_build_local_schemas(working_dir):
    schema_store = {}
    files = _files_in_working_dir(working_dir)
    for dataset_file in files:
        with open(dataset_file) as schema_file:
            schema = json.load(schema_file)
            Draft7Validator.check_schema(schema)
            schema_store[schema['$id']] = schema
    return schema_store


def _validate_data_schemas(core_schema_id, schema_store, working_dir):
    resolver = RefResolver(base_uri="", store=schema_store, referrer=None)
    validator = Draft7Validator(schema_store[core_schema_id], resolver=resolver)

    dataset_files = _files_in_working_dir(working_dir)
    for dataset_file in dataset_files:
        with open(dataset_file) as schema_file:
            schema = json.load(schema_file)
            validator.validate(schema)


if __name__ == "__main__":
    dirname = os.path.dirname(os.path.realpath(__file__))

    # Get full core_schema_id, i.e. the value that is in $id, not just the filename
    current_core_schema_file = dirname + WORKING_DIR + CORE_SCHEMA
    with open(current_core_schema_file) as current_core_schema:
        core_schema_id = json.load(current_core_schema)['$id']

    local_schemas = _check_and_build_local_schemas(dirname + WORKING_DIR)
    _validate_data_schemas(core_schema_id, local_schemas, dirname + DATASET_WORKING_DIR)
