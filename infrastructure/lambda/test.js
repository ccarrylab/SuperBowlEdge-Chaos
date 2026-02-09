exports.handler = async (event) => {
  const p = event.path || event.rawPath || '/test';
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ path: p, received: true, timestamp: new Date().toISOString() })
  };
};
