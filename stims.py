import csv
import json

def csv_to_json(csv_file_path, json_file_path=None):
    data = []
    
    # Read CSV file
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            data.append(row)
    
    # Convert to JSON string
    json_data = json.dumps(data, indent=4, ensure_ascii=False)
    
    # Optionally save to file
    if json_file_path:
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json_file.write(json_data)
    
    return json_data


# Example usage:
if __name__ == "__main__":
    csv_path = "fillerStims.csv"   # your CSV file
    json_path = "output.json"  # optional JSON output file
    json_object = csv_to_json(csv_path, json_path)
    print(json_object)
