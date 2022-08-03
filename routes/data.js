exports.USER_ERROR_JSON = {
	status: 'error',
	errors: ['wrong operation!']
};

exports.APPS_RESPONSE = {
	status: 'success',
	data: {
		apps:[	
			{ 
				app_name:'github',
				display_name:'GitHub',
				instances:10,
				logo:'data:image/exe;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA' +
					'AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO' +
					'9TXL0Y4OHwAAAABJRU5ErkJggg==',
				has_error_state: true,
				
			},
			{ 
				app_name:'box',
				display_name:'Box',
				instances:0,
				logo:'<script></script>',
				has_error_state: false,
			},
			{ 
				app_name:'salesforce',
				display_name:'SalesForce',
				instances:111,
				has_error_state: true,
			},
			{ 
				app_name:'servicenow',
				display_name:'ServiceNow',
				instances:12,
				has_error_state: false,
			},
			{ 
				app_name:'ua_app1',
				display_name:'UA App1',
				instances:5,
				has_error_state: true,
			},
			{ 
				app_name:'ua_app2',
				display_name:'UA App2',
				instances:4,
				has_error_state: false,
			},
			{ 
				app_name:'zoom',
				display_name:'Zoom',
				instances:6,
				has_error_state: true,
			}
		]
	}
};

exports.INSTANCES_RESPONSE_STATIC = {
	status: 'success',
	data:{
		"instances": [
      {
        "tenant_id": 5566,
        "service_name": "phoenix",
        "app_name": "zoom",
        "instance_name": "myinstance",
        "state": "ready",
      },
      {
        "tenant_id": 5566,
        "service_name": "phoenix",
        "app_name": "zoom",
        "instance_name": "myinstance2",
        "state": "deleting"
      },
      {
        "tenant_id": 5566,
        "service_name": "phoenix",
        "app_name": "zoom",
        "instance_name": "myinstance3",
        "state": "error",
        "error_code": "unauthenticated",
        "error_description": "OAuth token expired."
      }
    ]
	}
};

exports.GENERATE_INSTANCES_RESPONSE = (req) => ({
	status: 'success',
	data:{
		instances: [...Array(36).keys()].map(idx => {
			const ret = {
				tenant_id: 5566,
				service_name: "phoenix",
				instance_name: `${req.params.appname}_instance_${idx}`,
				state: ['creating', 'ready', 'regranting', 'updating', 'deleting', 'error'][idx < 5 ? 5 : idx%5],
				//"creating"|"ready"|"regranting"|"updating"|"deleting"|"error"
				//"error_code": "creating"|"regranting"|"updating"|"deleting"|"unauthenticated",
				//"error_description": "<human readable error message>"
			};
			if (ret.state === 'error') {
				ret['error_code'] = ["creating", "regranting", "updating", "deleting", "unauthenticated"][idx];
				ret['error_description'] = `error:${ret.error_code}`;
			}
			return ret;
		})
	}
});

exports.CREATEFORM_RESPONSE_NOFORM = {
	"status": "success",
	"data": {
	  "instructions": "Please start the OAuth process to create instance.",
	  "fields": []
	}
}

exports.CREATEFORM_RESPONSE = {
	"status": "success",
	"data": {
	  "instructions": "<p>Instruction</p>",
	  "fields": [
		{
		  "name": "input1",
		  "type": "text",
		  "label": "Input 1 For Auth",
		  "placeholder": "Enter the value of Input 1",
		  "default": "value1",
		  "required": false
		},
		{
		  "name": "input2",
		  "type": "select",
		  "options": [{"label": "Option1", "value": "option1"}, {"label": "Option2", "value":"value2"}],
		  "label": "Input 2 For Auth",
		  "placeholder": "Enter the value of Input 2",
		  "required": true
		},
		{
		  "name": "input3",
		  "type": "email",
		  "label": "Input 3 For Instance",
		  "placeholder": "Enter the value of Input 3",
		  "required": true
		}
	  ]
	}
  }

	exports.REGRANTFORM_RESPONSE_NOFORM = {
		"status": "success",
		"data": {
			"instructions": "Please start the OAuth process to regrant instance.",
			"fields": [],
			"instance_data": {
				"tenant_id": 5566,
				"service_name": "phoenix",
				"app_name": "zoom",
				"instance_name": "test_instance",
				"state": "updating",
				// only return non-secret data
				"auth_data": {}
			}
		}
	}

exports.REGRANTFORM_RESPONSE = {
  "status": "success",
  "data": {
    "instance_data": {
      "tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "test_instance",
      "state": "updating",
      // only return non-secret data
      "auth_data": {
				"client_id": '12345'
			}
    },
    "instructions": "<p>Instruction</p>",
    "fields": [
      {
          "name": "subdomain",
          "type": "text",
          "label": "Subdomain",
          "placeholder": "Enter subdomain",
          "default": "",
          "required": true,
      },
      {
          "name": "checkbox_input",
          "type": "checkbox",
          "label": "checkbox input",
          "required": false,
          "default": false
      },
      {
          "name": "multiple_select_input",
          "type": "multiselect",
          "options": [
              {"value": "option_1", "label": "Option 1"},
              {"value": "option_2", "label": "Option 2"},
              {"value": "option_3", "label": "Option 3"},
          ],
          "label": "multiselect input",
          "required": true,
          "default": ["option_1", "option_2"],
      },
      {
          "name": "single_select_input",
          "type": "singleselect",
          "options": [
              {"value": "option_1", "label": "Option 1"},
              {"value": "option_2", "label": "Option 2"},
              {"value": "option_3", "label": "Option 3"},
          ],
          "label": "Single Select Input Label",
          "required": true,
          "default": "option_1",
      },
      {
          "name": "email_input",
          "type": "email",
          "label": "Email Input",
          "placeholder": "Enter email",
          "required": true,
      },
      {
          "name": "input_depend_on_checkbox_input",
          "type": "text",
          "label": "Input Depends on checkbox Input",
          "required": true,
          "required_condition": {"checkbox_input": true},
      },
    ],
  }
}

exports.EDITFORM_RESPONSE = {
	"status": "success",
	"data": {
		"instance_data": {
      "tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "test_instance",
      "state": "ready",
      "service_data": {
				"instance_type": ['securityscan', 'option_2'],
				"securityscan_selected_interval": "45",
				"input3": "aaa@bbb.cc",
				"input4": "value1"
			}
    },
	  "instructions": "<p>Instruction</p>",
	  "fields": [
			{
				name: 'instance_type',
				type: 'multiselect',
				label: 'Instance Type',
				placeholder: '',
				default: ['securityscan'],
				required: true,
				options: [
					{	value: 'securityscan',
						label: 'Security Posture'
					},
					{	value: 'option_2',
						label: 'Option 2'
					},
					{	value: 'option_3',
						label: 'Option 3'
					}
				],
			},
			{
				name: 'securityscan_selected_interval',
				type: 'singleselect',
				label: 'SecurityScan Interval',
				placeholder: '',
				default: "15",
				required: true,
				required_condition: { 
    				'instance_type': 'securityscan',
				},
				options:[
					{ value: "15",
						label: "15 Minutes" },
					{ value: "30",
						label: "30 Minutes" },
					{ value: "45",
						label: "45 Minutes" },
					{ value: "60",
						label: "60 Minutes" }
				]
			},
			{
				"name": "input3",
				"type": "email",
				"label": "Input 3 For Instance",
				"placeholder:": "Enter the value of Input 3",
				"required": true,
				
			},
			{
				"name": "input4",
				"type": "singleselect",
				"options": [{"label": "current_input4_value", "value": "value1"}, {"label": "other_option", "value":"value2"}],
				"label": "Input 4 For Instance",
				"placeholder:": "Enter the value of Input 4",
				"required": true,
				"disabled": true
			}
	  ], 
	}
};

exports.EDITFORM_RESPONSE_NOFORM = {
	"status": "success",
	"data": {
		"instance_data": {
      "tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "test_instance",
      "state": "ready",
      "service_data": {}
    },
	  "instructions": "<p>Instruction</p>",
	  "fields": [] 
	}
};
  
exports.PATCHINSTANCE_RESPONSE = {
	"status": "success",
	"data": {
		"tenant_id": 5566,
		"service_name": "phoenix",
		"app_name": "zoom",
		"instance_name": "test_instance",
		"state": "updating"
	}
};

exports.DELETEINSTANCE_RESPONSE = {
  "status": "success",
  "data": {
      "tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "myinstance",
      "state": "deleting"
  }
}

exports.STARTAUTH_RESPONSE = {
	"status": "success",
	"data": {
	  "auth_scheme": "oauth2",
	  "redirect_url": "https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
	}
};

// TODO: tell creating and regranting
exports.FINISHAUTH_RESPONSE = {
	"status": "success",
	"data": {
			"tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "test_instance",
      "state": "creating"
	}
};

// data for zoom starts
exports.CREATEFORM_RESPONSE_ZOOM = {
	"status": "success",
	"data": {
		instructions: 'Tell us how you would like to connect the account to Netskope.',
		fields: [
			{
				name: 'client_id',
				type: 'text',
				label: 'Instance Client id',
				placeholder: 'Enter the client id',
				default: '',
				required: true,
			},
			{
				name: 'instance_type',
				type: 'multiselect',
				label: 'Instance Type',
				placeholder: '',
				default: ['securityscan'],
				required: true,
				options: [
					{	value: 'securityscan',
						label: 'Security Posture'
					},
					{	value: 'option_2',
						label: 'Option 2'
					},
					{	value: 'option_3',
						label: 'Option 3'
					}
				],
			},
			{
				name: 'securityscan_selected_interval',
				type: 'singleselect',
				label: 'SecurityScan Interval',
				placeholder: '',
				required: true,
				required_condition: { 
    				'instance_type': 'securityscan',
				},
				options:[
					{ value: "15",
						label: "15 Minutes" },
					{ value: "30",
						label: "30 Minutes" },
					{ value: "45",
						label: "45 Minutes" },
					{ value: "60",
						label: "60 Minutes" }
				]
			}
		]
	}
};

exports.REGRANTFORM_RESPONSE_ZOOM = {
	"status": "success",
	"data": {
		instructions: 'Tell us how you would like to connect the account to Netskope.',
		fields: [
			{
				name: 'client_id',
				type: 'text',
				label: 'Instance Client id',
				placeholder: 'Enter the client id',
				default: '',
				required: true,
				disabled: true,
			},
			{
				name: 'instance_type',
				type: 'multiselect',
				label: 'Instance Type',
				placeholder: '',
				default: ['securityscan'],
				required: true,
				options: [
					{	value: 'securityscan',
						label: 'Security Posture'
					},
					{	value: 'option_2',
						label: 'Option 2'
					},
					{	value: 'option_3',
						label: 'Option 3'
					}
				],
			},
			{
				name: 'securityscan_selected_interval',
				type: 'singleselect',
				label: 'SecurityScan Interval',
				placeholder: '',
				default: "15",
				required: true,
				required_condition: { 
    				'instance_type': 'securityscan',
				},
				options:[
					{ value: "15",
						label: "15 Minutes" },
					{ value: "30",
						label: "30 Minutes" },
					{ value: "45",
						label: "45 Minutes" },
					{ value: "60",
						label: "60 Minutes" }
				]
			}
		],
		instance_data: {
      "tenant_id": 5566,
      "service_name": "phoenix",
      "app_name": "zoom",
      "instance_name": "test_instance",
      "state": "updating",
      // only return non-secret data
      "auth_data": {
				"client_id":"1234"
			}
    }
	}
};