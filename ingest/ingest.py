# run: `python ingest.py csv > inactivations.json`

import os
import sys
import csv
import json

# get the path argument from command line
path = sys.argv[1]

# change the current working directory to the given path
os.chdir(path)

# initialize an empty dictionary to hold the data
d = {}

# round the number to 1 decimal place
def formatNumber(num):
    num = round(float(num), 1)
    return num

# loop through all csv files in the current directory
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    # split the csv filename into disinfectant and pathogen names
    _ = csv_name[:-4].split('__')
    disinfectant = _[0]
    pathogen = _[1]
    
    # create nested dictionaries for disinfectant, pathogen, and temperature
    if disinfectant not in d:
        d[disinfectant] = {}

    if pathogen not in d[disinfectant]:
        d[disinfectant][pathogen] = {}

    # loop through each row in the csv file
    for row in csv.reader(open(csv_name)):
        # extract the inactivation log from the first column
        inactivation_log = formatNumber(row.pop(0))

        # loop through the remaining columns and extract temperature and inactivation values
        for i in range(len(row)):
            temperature = formatNumber(i + 1)
            if temperature not in d[disinfectant][pathogen]:
                d[disinfectant][pathogen][temperature] = {}
            d[disinfectant][pathogen][temperature][inactivation_log] = float(row[i])



# handle the special case of free_chlorine__giardia
os.chdir('free_chlorine__giardia')
disinfectant = 'free_chlorine'
pathogen = 'giardia'
d[disinfectant][pathogen] = {}

# iterate through each CSV file in the directory that ends with .csv
for csv_name in list(filter(lambda x: '.csv' in x, os.listdir('.'))):
    # extract the temperature from the filename by removing the .csv extension and splitting on '_'
    temperature = formatNumber(csv_name[:-4].split('_')[1])
    # set the initial pH base to 6
    ph_base = 6

    # create a nested dictionary for the temperature if it doesn't already exist
    if temperature not in d[disinfectant][pathogen]:
        d[disinfectant][pathogen][temperature] = {}

    # iterate through each row in the CSV file using the csv.reader() method
    for row in csv.reader(open(csv_name)):
        # extract the concentration value from the first column and round to 1 decimal place
        concentration = formatNumber(row.pop(0))

        # create a nested dictionary for the concentration if it doesn't already exist
        if concentration not in d[disinfectant][pathogen][temperature]:
            d[disinfectant][pathogen][temperature][concentration] = {}

        # set a counter variable for the pH values
        ph_i = 0
        # iterate through each remaining value in the row
        for i in range(len(row)):
            # calculate the pH value using the pH index (ph_i) and the pH base
            ph = formatNumber((ph_i * 0.5) + ph_base)
            # create a nested dictionary for the pH if it doesn't already exist
            if ph not in d[disinfectant][pathogen][temperature][concentration]:
                d[disinfectant][pathogen][temperature][concentration][ph] = {}

            # calculate the inactivation log value using the position in the row (m) and the formula (m * 0.5 + 0.5)
            m = i % 6
            inactivation_log = formatNumber((m * 0.5) + 0.5)
            # set the value in the nested dictionary for the pH, concentration, and temperature
            d[disinfectant][pathogen][temperature][concentration][ph][inactivation_log] = row[i]

            # increment the pH index when 6 values have been processed
            if m == 5:
                ph_i = ph_i + 1

        # update the pH base and index values when the concentration is 3.0
        if concentration == 3.0:
            ph_base = 8
            ph_i = 0

# print the dictionary as a JSON string with separators
print(json.dumps(d, separators=(',', ':')))
