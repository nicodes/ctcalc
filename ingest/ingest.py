# run: `python ingest.py csv > inactivations.json`

import os
import sys
import csv
import json

path = sys.argv[1]
os.chdir(path)

d = {}

# everything besides free_chlorine__giardia
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    _ = csv_name[:-4].split('__')
    disinfectant = _[0]
    pathogen = _[1]
    
    if disinfectant not in d:
        d[disinfectant] = {}

    if pathogen not in d[disinfectant]:
        d[disinfectant][pathogen] = {}

    for row in csv.reader(open(csv_name)):
        inactivation_log = row.pop(0)
        if inactivation_log not in d[disinfectant][pathogen]:
            d[disinfectant][pathogen][inactivation_log] = {}

        for i in range(len(row)):
            d[disinfectant][pathogen][inactivation_log][i + 1] = float(row[i])

# free_chlorine__giardia
os.chdir('free_chlorine__giardia')
disinfectant = 'free_chlorine'
pathogen = 'giardia'
d[disinfectant][pathogen] = {}

sql_vals = []
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    temperature = csv_name[:-4].split('_')[1]
    ph_base = 6

    if temperature not in d[disinfectant][pathogen]:
        d[disinfectant][pathogen][temperature] = {}

    for row in csv.reader(open(csv_name)):
        concentration = row.pop(0)     
        d[disinfectant][pathogen][temperature][concentration] = {}

        ph_i = 0
        for i in range(len(row)):
            m = i % 6
            ph = (ph_i * 0.5) + ph_base
            if ph not in d[disinfectant][pathogen][temperature][concentration]:
                d[disinfectant][pathogen][temperature][concentration][ph] = {}
            
            inactivation_log = (m * 0.5) + 0.5
            d[disinfectant][pathogen][temperature][concentration][ph][inactivation_log] = float(row[i])

            if m == 5:
                ph_i = ph_i + 1
            
        if concentration == '3':
            ph_base = 8
            ph_i = 0

print(json.dumps(d, separators=(',', ':')))
