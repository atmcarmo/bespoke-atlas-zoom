// agents.js
var faker = require('faker')

function generateAgents () {
  let agents = [];
  const presence_options = ['Available', 'Away'];
  const totalCount = 50;
  for (let id = 100000; id < 100000 + totalCount; id++) {
    let firstName = faker.name.firstName()
    let lastName = faker.name.lastName()
    let email = faker.internet.email()
    let phone = faker.phone.phoneNumber("+1-###-###-####")
    let extension = faker.phone.phoneNumber("####")
    let presenceStatus = faker.random.arrayElement(presence_options);
    agents.push({
      "zoomId": id.toString(),
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "phone": phone,
      "extension": extension,
      "presence":  presenceStatus
    })
  }
  return { agents }

}

module.exports = generateAgents