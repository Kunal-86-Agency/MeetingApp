

function UserCreationTemplate(user) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Information</title>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }
  
      th, td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
  
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
  
    <h2>User Information</h2>
    <table>
      <tr>
        <th>Name</th>
        <td>${user.name}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${user.email}</td>
      </tr>
      <tr>
        <th>Password</th>
        <td>${user.password}</td>
      </tr>
      <tr>
        <th>Role</th>
        <td>${user.role}</td>
      </tr>
      <tr>
        <th>Department</th>
        <td>${user.department}</td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td>${user.phone_number}</td>
      </tr>
      <tr>
        <th>Working Status</th>
        <td>${user.working_status}</td>
      </tr>
    </table>
  
  </body>
  </html>`
}

module.exports = UserCreationTemplate;
