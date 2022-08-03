var MOCK = require('./data.js'); 
var MOCK_INVENTORY = require('./inventory-data.js');
var express = require('express');
var router = express.Router();
var http = require('http');
const Url = require('url');
const port = process.env.PORT || '3000';


const DEBUG = {
  E400: 400,
  E500: 500,
  STARTAUTH_SET_REDIRECT_URL_VALID: 'STARTAUTH_SET_REDIRECT_URL_VALID',
  STARTAUTH_SET_REDIRECT_URL_INVALID: 'STARTAUTH_SET_REDIRECT_URL_INVALID',
};

const wrapper = function(fn) {
  return (req, res, next)=> {
    console.log(req.params);
    fn(req, res, next);
  }
}

const wrapper_log_body = function(fn) {
  return (req, res, next)=> {
    console.log(req.params);
    console.log('Payload: \n', req.body);
    fn(req, res, next);
  }
}

/* ======================================================================
 * failed endpoint mock up
 * ======================================================================
*/

// failed responses
router.get('/alwaysFailed400', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(400);
  var ret = MOCK.USER_ERROR_JSON
  res.send(ret)
});

router.get('/alwaysFailed500', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(500).send('something broken');  
});

/* ======================================================================
 * unified auth server mock up
 * ======================================================================
*/

const METHOD = {
  POST: 'post',
  GET: 'get',
  DELETE: 'delete',
  PATCH: 'patch'
};

// inventory 
const ENDPOINTS_INVENTORY = {
  RESOURCES: {
    path: '/inventory/getresources',
    method: METHOD.POST,
    status: 200,
    response: MOCK_INVENTORY.RESOURCES,
  },
  FILTERS: {
    path: '/inventory/filters',
    method: METHOD.GET,
    status: 200,
    response: MOCK_INVENTORY.FILTERS,
  },
  FILTERS_VALUE: {
    path: '/inventory/filters/getvalues',
    method: METHOD.POST,
    status: 200,
    response: MOCK_INVENTORY.FILTERS_VALUES,
  },
  FIELDS: {
    path: '/inventory/getfields',
    method: METHOD.POST,
    status: 200,
    response: MOCK_INVENTORY.FIELDS,
  },
  DETAILS: {
    path: '/inventory/:id',
    method: METHOD.POST,
    status: 200,
    response: MOCK_INVENTORY.DETAILS,
  }
}

// unified auth
const ENDPOINTS_GET = {
  APPS: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps',
    method: METHOD.GET,
    status: 200,
    response: MOCK.APPS_RESPONSE,
    // debug_set: 400
  },
  INSTANCES: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances',
    method: METHOD.GET,
    status: 200,
    response: MOCK.GENERATE_INSTANCES_RESPONSE,
    // debug_set: 400
  },
  CREATEFORM: { 
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/_/create_form',
    method: METHOD.GET,
    status: 200,
    response: MOCK.CREATEFORM_RESPONSE_ZOOM,
    // use MOCK.CREATEFORM_RESPONSE_NOFORM to test the no-form flow
    // response: MOCK.CREATEFORM_RESPONSE_NOFORM,
    // debug_set: 500
  },
  REGRANTFORM: { 
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename/regrant_form',
    method: METHOD.GET,
    status: 200,
    response: MOCK.REGRANTFORM_RESPONSE
  },
  EDITFORM: { 
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename/edit_form',
    method: METHOD.GET,
    status: 200,
    response: MOCK.EDITFORM_RESPONSE
  },
};

const ENDPOINTS_POST = {
  STARTAUTH: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename/start_auth',
    status: 200,
    method: METHOD.POST,
    response: MOCK.STARTAUTH_RESPONSE,
    debug_set: DEBUG.STARTAUTH_SET_REDIRECT_URL_INVALID
    // debug_set: 400
  },
  FINISHAUTH: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename/finish_auth',
    method: METHOD.POST,
    status: 200,
    response: MOCK.FINISHAUTH_RESPONSE,
    // debug_set: 400
  }
}

const ENDPOINTS_PATCH = {
  PATCHINSTANCE: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename',
    method: METHOD.PATCH,
    status: 200,
    response: MOCK.PATCHINSTANCE_RESPONSE,
    // debug_set: 400
  }
}
const ENDPOINTS_DELETE = {
  DELETEINSTANCE: {
    path: '/internal/tenants/:tenantid/services/:servicename/apps/:appname/instances/:instancename',
    method: METHOD.DELETE,
    status: 200,
    response: MOCK.DELETEINSTANCE_RESPONSE,
    // debug_set: 500
  }
}

// configs
const CONFIG_UNIFIED_AUTH = {
  ...ENDPOINTS_GET,
  ...ENDPOINTS_POST,
  ...ENDPOINTS_PATCH,
  ...ENDPOINTS_DELETE
};

const CONFIG_INVENTORY = {
  ...ENDPOINTS_INVENTORY
};

const _setRouter = (ep_config) => {
  const method = ep_config.method;
  const {path, status, response, debug_set} = ep_config;
  const handler = 
    (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.setHeader('Content-Type', 'application/json');
      if (typeof debug_set === 'undefined'){
        res.status(status);
        
        res.send(JSON.stringify(
          typeof response === 'function' ? response(req) : response  
        ));
        return;
      }
      const rest_query_string = '&aaa=1&bbb=2';
      switch(debug_set) {
        case DEBUG.E400:
          res.status(400);
          res.send(JSON.stringify(MOCK.USER_ERROR_JSON));
          break;
        case DEBUG.E500:
          res.status(500);
          res.send('something broken!');
          break;
        case DEBUG.STARTAUTH_SET_REDIRECT_URL_VALID:
          console.log(req.body);
          const redirect_url_valid = `http://localhost:${port}` +
            `/happy_login?goto=${encodeURIComponent(req.body.oauth_success_redirect_url)}`;
          response.data.redirect_url = redirect_url_valid + rest_query_string;
            res.status(status);
          res.send(JSON.stringify(response));
          break;
        case DEBUG.STARTAUTH_SET_REDIRECT_URL_INVALID:
          const redirect_url_invalid = `http://localhost:${port}` +
            `/happy_login?goto=${encodeURIComponent(req.body.oauth_success_redirect_url)}` +'aabb' ;
          response.data.redirect_url = redirect_url_invalid + rest_query_string;
            res.status(status);
          res.send(JSON.stringify(response));
          break;
        default:
          throw new Error('Wrong type for debug_set!');
          break;   
      }
    };

  if (method === 'get') {
    router.get(path, wrapper(handler));
  } else if (method === 'post') {
    router.post(path, wrapper_log_body(handler));
  } else if (method === 'patch') {
    router.patch(path, wrapper_log_body(handler));
  } else if (method === 'delete') {
    router.delete(path, wrapper_log_body(handler));
  }

}

function setRouters(endpointsConfig) {
    for (const [key, endpoint] of Object.entries(endpointsConfig)) {
      const method = endpoint.method;
      console.log(`serve (${method}): `, endpoint.path);
      _setRouter(endpoint);
    }
}


router.get('/happy_login', (req, res, next) => {
  res.status(302);
  const goto_url = req.query.goto;
  const full_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const urlObj = new Url.URL(full_url);
  console.log('<Full Url>: ', full_url);
  console.log('<search>: ', urlObj.search)
  res.redirect(goto_url + (urlObj.search ? urlObj.search : ''));
});

setRouters(CONFIG_INVENTORY);
module.exports = router;
