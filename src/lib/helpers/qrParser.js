export default getConfig = (data) => {

    console.log('data',data)
    const config = {wifi: {}, master: {}, visitor: {}};
    data = data.replace(CONSTS.APP_URI,'');
    if (!/^s[a-zA-Z0-9]{12},[^|]*|[^|]*/.test(data))
        return config;
    let idPre, preALL, preALLChunks;
    if (data.includes(',')) {
        [idPre, preALL] = data.split(',');
    } else {
        [idPre, ...preALLChunks] = data.split('|');
        preALL = '|' + preALLChunks.join('|')
    }

    const id = idPre.substring(1);
    const [wpass, ...pre] = preALL.split('|');
    if (wpass != '') {
        config.wifi.ssid = `${CONSTS.WIFI_VOLA_PRE}${id}`;
        config.wifi.password = wpass;
    }

    pre.forEach(c => {
        if (!/^[sm]*/.test(c))
            return;
        const type = c.substring(0, 1);
        const data = c.substring(1).toLowerCase();
        switch (type) {
            case 'v':
                config.visitor.id = id.toLowerCase();
                config.visitor.key = data;
                config.visitor.keyType = "visitor";
                break;
            case 'm':
                config.master.id = id.toLowerCase();
                config.master.key = data;
                config.master.keyType = "master";
                break;
        }
    });
    console.log(config)
    return config
};