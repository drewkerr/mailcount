#! /usr/bin/python3
# <xbar.title>Mail Count</xbar.title>
# <xbar.version>v1.0</xbar.version>
# <xbar.author>Andrew Kerr</xbar.author>
# <xbar.author.github>drewkerr</xbar.author.github>
# <xbar.desc>Count the number of daily emails.</xbar.desc>
# <xbar.dependencies>python3</xbar.dependencies>

from datetime import date, datetime, timedelta
import itertools
import json
import os
import subprocess

cache_file = f'{os.environ.get("SWIFTBAR_PLUGIN_DATA_PATH")}/mailcount.json'
date_format = '%d-%m-%Y'

def read_json_file(file_path):
  with open(file_path, 'r') as file:
    try:
      json_data = json.load(file)
      return json_data
    except json.JSONDecodeError:
      return {}

def write_json_file(file_path, data):
  with open(file_path, 'w') as file:
    json.dump(data, file)

def get_count(mail_date):
    next_date = (datetime.strptime(mail_date, date_format) + timedelta(days=1)).strftime(date_format)
    script = f'tell application "Mail" to get count of (every message of every mailbox of every account whose date sent > date "{mail_date}" and date sent < date "{next_date}")'
    complete = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
    output = complete.stdout.strip()
    return int(output)

json_dict = read_json_file(cache_file)
json_dict = dict(itertools.islice(json_dict.items(), 1, None))

today = date.today()
date_dict = {}
for i in range(28):
  current_date = (today - timedelta(days=i)).strftime(date_format)
  date_dict[current_date] = json_dict[current_date] if current_date in json_dict else get_count(current_date)

write_json_file(cache_file, date_dict)

latest = next(iter(date_dict.values()))
print(':envelope:')
print('---')
print(f'{latest} emails today')
