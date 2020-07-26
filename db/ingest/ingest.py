# example:
# python ingest.py data > ingest.sql

import os
import sys
import csv

path = sys.argv[1]
os.chdir(path)

# everything besides free_chlorine__giardia
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    _ = csv_name[:-4].split('__')
    disinfectant = _[0]
    pathogen = _[1]

    sql_vals = []
    for row in csv.reader(open(csv_name)):
        inactivation_log = row.pop(0)
        for i in range(len(row)):
            sql_vals.append('({0},{1},{2})'.format(i + 1, inactivation_log, row[i]))

    sql = 'INSERT INTO {0}.{1} (temperature, inactivation_log, inactivation) VALUES '.format(disinfectant, pathogen)
    sql = sql + ','.join(sql_vals) + ';'
    print(sql)

# free_chlorine__giardia
os.chdir('free_chlorine__giardia')
disinfectant = 'free_chlorine'
pathogen = 'giardia'

sql_vals = []
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    temperature = csv_name[:-4].split('_')[1]
    ph_base = 6

    for row in csv.reader(open(csv_name)):
        concentration = row.pop(0)     
        ph_i = 0
        
        for i in range(len(row)):
            m = i % 6
            ph = (ph_i * 0.5) + ph_base
            inactivation_log = (m * 0.5) + 0.5

            sql_vals.append('({0},{1},{2},{3},{4})'.format(temperature, inactivation_log, ph, concentration, row[i]))

            if m == 5:
                ph_i = ph_i + 1
            
        if concentration == '3':
            ph_base = 8
            ph_i = 0

sql = 'INSERT INTO {0}.{1} (temperature, inactivation_log, ph, concentration, inactivation) VALUES '.format(disinfectant, pathogen)
sql = sql + ','.join(sql_vals) + ';'
print(sql)
