import urllib.request, json, csv, time, logging

SERVICE_CATEGORIES = [
        { 'filename': 'cloudservices.json', 'title': 'Cloud Services' },
        { 'filename': 'emailservice.json', 'title': 'Email Services' },
        { 'filename': 'fixedbroadband.json', 'title': 'Fixed Broadband' },
        { 'filename': 'messagingvoip.json', 'title': 'Messaging & VoIP' },
        { 'filename': 'mobileeco.json', 'title': 'Mobile Ecosystems' },
        { 'filename': 'prepostpaidmobile.json', 'title': 'Pre-and Post-Paid Mobile' },
        { 'filename': 'searchservice.json', 'title': 'Search' },
        { 'filename': 'socialnetworkblog.json', 'title': 'Social Network & Blog' },
        { 'filename': 'videophoto.json', 'title': 'Video/Photo' }
        ]

RAW_DATA_URL_TEMPLATE = 'https://github.com/rankingdigitalrights/index2017/raw/master/app/assets/static/services/{filename}'

CSV_FIELD_NAMES = ['metric', 'category', 'service', 'company', 'value', 'rank']

METRICS = [
        { 'key': 'Total', 'title': 'Total' },
        { 'key': 'G', 'title': 'Governance' },
        { 'key': 'FoE', 'title': 'Freedom of Expression' },
        { 'key': 'P', 'title': 'Privacy' }
        ]

def download_with_retry(url, retries = 3):
    try:
        logging.info('Requesting {} - Retries {}'.format(url, retries))
        with urllib.request.urlopen(url) as f:
            return json.loads(f.read().decode('utf-8'))
    except Exception as e:
        if retries > 0:
            time.sleep(1)
            return download_with_retry(url, retries - 1)
        else:
            raise e

def get_service_data():
    category_services = {}
    for category in SERVICE_CATEGORIES:
        url = RAW_DATA_URL_TEMPLATE.format(**category)
        category_services[category['title']] = download_with_retry(url)
        time.sleep(3)

    return category_services

def add_ranks(data):
    # Companies are ranked within a scope defined by metric-category pairs
    for category, services in data.items():
        for metric in METRICS:
            services.sort(key=lambda s: float(s[metric['key']]), reverse=True)
            rank = 1
            last_value = 1000
            for i, service in enumerate(services):
                service[metric['key']] = float(service[metric['key']])
                if service[metric['key']] < last_value:
                    rank = i + 1
                service[metric['key'] + '_rank'] = rank
                last_value = service[metric['key']]
    return data

def write_csv(data, outfile = 'latest_rdr_data.csv'):
    with open(outfile, 'w') as out:
        writer = csv.DictWriter(out, CSV_FIELD_NAMES)
        writer.writeheader()
        for category, services in data.items():
            for service in services:
                for metric in METRICS:
                    writer.writerow({
                        'metric': metric['title'],
                        'category': category,
                        'service': service['Service '],
                        'company': service['Company'],
                        'value': service[metric['key']],
                        'rank': service[metric['key'] + '_rank']
                        })

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    data = get_service_data()
    with_ranks = add_ranks(data)
    write_csv(with_ranks)
