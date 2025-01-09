
	
	Backend Requirement ->
	User object ->
	user_name: email (unique)
	first_name, last_name
	password: encrypted
	is_active: //true by default and can be disabled later from frontend
	user_type: enum Admin/Manager/Employee
	
	Add user ->
	Only Admin/Manager are allowed to add Admin/Manager/Employee user
	Take user object as input
	return all cases like user_name exists, password checks
	
	Edit user ->
	Manager are allowed to edit a user data
	Admin are allowed to manager users i.e delete
	
	Employees should have rights to create, update, and search
	for leads, contacts, service requests.
	
	Employees who doesn't have any rights can be allowed to view only leads,
	contacts, service requests.
	
	Create a middleware system for access rights.
	
	Requests can only be made from particular domain only.
	
	Use nodemailer for forgot password flow
		Validate entered email id
		Then send an email with an access token
		take them to forgot password page
		check if that token exists in temp tokens collection
		delete it once used
		if token is deleted, show error as token has been expired
		
	Dashboard ->
		It should show total created contacts, leads, service requests.
		Dashboard should be set to view only on deactivated user account
		Admin should get admin options
		Manager should get his options
		Create a custom token with their id and evaulate that id
		If any lead or service is created backend should notify
		admin and manager about it.
		
	Requests should come with a valid token
	

	Lead Statuses ->
		New, Contacted, Qualified, Lost, Canceled, Confirmed
	
	Service Request Statuses ->
		Created, Open, In Process, Released, Canceled, Completed
		
	Employee should also be able to change the status of lead
	
	 
	
