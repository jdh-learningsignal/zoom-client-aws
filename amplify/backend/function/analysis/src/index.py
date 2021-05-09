import json
import requests

API_URL = "https://qf2bjn3cbrefton7n7vple6l5e.appsync-api.ap-northeast-2.amazonaws.com/graphql"
API_KEY = "da2-j5ymrnchmjaxhesdhnqpddx3y4"
headers = {
    "x-api-key": API_KEY
}
statusCode = 200

listTrafficsArchivess = """
{
    listTrafficsArchivess {
        items {
            affiliation
            createdAt
            hash
            id
            originCreatedAt
            originId
            pageNumber
            state
            studentId
            updatedAt
        }
        nextToken
    }
}
"""


def run_query(uri, query, statusCode, headers):
    request = requests.post(uri, json={'query': query}, headers=headers)
    if request.status_code == statusCode:
        return request.json()
    else:
        raise Exception(
            f"Unexpected status code returned: {request.status_code}")


def handler(event, context):
  result = run_query(API_URL, listTrafficsArchivess, statusCode, headers)

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(result)
  }
