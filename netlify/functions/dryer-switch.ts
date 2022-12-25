import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import { sha256 } from 'js-sha256'
import hash from 'hash.js'
import axios from 'axios'

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const clientId = 'npxwnx4v75g8y499wgx8'
  const clientSecret = process.env.TUYA_CLIENT_SECRET

  const deviceId = '72363820c4dd5703cd72'

  const sign = (str: string, secret: string) =>
    sha256.hmac(secret, str).toUpperCase()

  const signedHeaders = (
    id,
    secret,
    method,
    url,
    accessToken = '',
    body = ''
  ) => {
    const t = new Date().valueOf()
    const nonce = uuidv4()
    const contentDigest = hash.sha256().update(body).digest('hex')
    const areaId = 'Tokyo/Japan'
    const callId = nanoid()

    const stringToSign = `${method}
${contentDigest}
area_id:${areaId}
call_id:${callId}

${url}`

    const str = `${clientId}${accessToken}${t}${nonce}${stringToSign}`

    return {
      client_id: id,
      sign: sign(str, secret),
      sign_method: 'HMAC-SHA256',
      t,
      nonce,
      'Signature-Headers': 'area_id:call_id',
      area_id: 'Tokyo/Japan',
      call_id: callId,
    }
  }

  const switchValue = JSON.parse(event.body)?.switch || false

  axios
    .get('https://openapi-ueaz.tuyaus.com/v1.0/token?grant_type=1', {
      headers: signedHeaders(
        clientId,
        clientSecret,
        'GET',
        '/v1.0/token?grant_type=1'
      ),
    })
    .then((r) => r.data)
    .then((j) => {
      if (j.success) {
        const accessToken = j.result.access_token
        const body = {
          commands: [{ code: 'switch_1', value: switchValue }],
        }

        console.log(body)

        axios
          .post(
            `https://openapi-ueaz.tuyaus.com/v1.0/iot-03/devices/${deviceId}/commands`,
            JSON.stringify(body),
            {
              headers: {
                'Content-Type': 'application/json',
                access_token: accessToken,
                ...signedHeaders(
                  clientId,
                  clientSecret,
                  'POST',
                  `/v1.0/iot-03/devices/${deviceId}/commands`,
                  accessToken,
                  JSON.stringify(body)
                ),
              },
            }
          )
          .then((r) => console.log(r.data))
      } else {
        console.log(j)
      }
    })

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'turned!' }),
  }
}

export { handler }
