const Consul = require('consul-kv');
 
const consul = new Consul({
  host: 'consul-fat.zmops.cc',
  port: '8500',
  protocol: 'http',
  strictSSL: true,
});

(async ()=>{
    const result = await consul.get('icons', { recurse: true })
    console.log(result.value)
})()
