//Initial Connection Setup to JSON-RPC API
async function initConnect() {
  try {
    const response = await fetch('jsonrpc')
    const json = await response.json();
    console.log('Successfully Established Connection:', json.description);
    return json
  }
  catch (error) {
    console.error('Error Establishing Connection:', error);
  };
}

//POST without returning result
async function sendMessage(method, params) {

    var info = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1};
    try {  
      const response = await fetch('jsonrpc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      })
      const json = await response.json();
      console.log('Success: ',method,' : ', json);
    }
    catch (error) {
      console.error('Error:',method,' : ', error);
    };
}

//POST with returning result
async function getMessage(method, params) {

  var info = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1};
  try {  
    const response = await fetch('jsonrpc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    })
    const json = await response.json();
    console.log('Success: ',method,' : ', json);
    return json.result
  }
  catch (error) {
    console.error('Error:',method,' : ', error);
  };
}

// Batch POST
async function updateState(method_1, params_1, method_2, params_2, method_3, params_3) {
  var info = [
      {"jsonrpc": "2.0", "method": method_1, "params": params_1, "id": 1},
      {"jsonrpc": "2.0", "method": method_2, "params": params_2, "id": 2},
      {"jsonrpc": "2.0", "method": method_3, "params": params_3, "id": 3}
    ]
  // var info = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1};
  try {
    const response = await fetch('jsonrpc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    })
    const json = await response.json();
    console.log('Update : percent =', Math.trunc(json[0].result.percentage),' volume =', json[1].result.volume,' track =',json[2].result.item.label);
    return json
  }
  catch (error) {
    console.error('Update : ', error);
  };
}

