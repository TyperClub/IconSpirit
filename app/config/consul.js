const Consul = require('consul-kv');
 
const consul = new Consul({
  host: 'consul-fat.zmops.cc',
  port: '8500',
  protocol: 'http',
  strictSSL: true,
});

module.exports.consulConfig = async ()=>{
    const result = await consul.get('icons', { recurse: true })
    return JSON.parse(result.value)
}