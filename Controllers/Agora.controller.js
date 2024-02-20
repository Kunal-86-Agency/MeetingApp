
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

require("dotenv").config();

const appId = '2a0f829f006846b1959ff90f5c834cc3';
const channelName = 'safari';
const uid = 0;
const appCertificate = '9c72b7d28954448ab97e4f4a8cdb4791';


exports.getToken = async (req, res) => {
    try {
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

        const agoratoken = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);

        return res.status(200).send({ message: "New Token", success: true, token: agoratoken })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error?.message || "Server Error 500" })
    }
}