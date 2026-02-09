exports.handler = async (event) => {
  const p = event.path || event.rawPath || '/test';
  const headers = {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'};

  if (p.includes('/metrics')) {
    return {statusCode:200,headers,body:JSON.stringify({requestsPerSec:1247,errorRate:0.002,latencyP95:187})};
  }
  if (p.includes('/nfl-scores')) {
    return {statusCode:200,headers,body:JSON.stringify({nfl:{away:'PHI:24',home:'KC:21',status:'Final',clock:'0:00'}})};
  }
  return {statusCode:404,headers,body:JSON.stringify({error:'Route not found'})};
};
