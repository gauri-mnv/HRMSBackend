
#  HRMS — Human Resource Management System

## 🧠 Project Overview

**HRMS** is a full-stack Human Resource Management System that covers employee management, attendance, leave, payroll, roles, departments, and admin/HR  workflows with other departments also via intuitive dashboards for admins and employees.

This system provides:

* Secure login for Admin, HR and employees
* Employee CRUD & profile management
* Attendance logging and records
* Leave request creation & approval workflows
* Payroll overview
* Role & Department management

---

## 🚀 Features (Short Description)

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **Admin Panel**         | Central dashboard for HR/Admin controls               |
| **Employee Dashboard**  | Personal employee view of attendance, leave & payroll |
| **Attendance Logging**  | Employees can log attendance, view history            |
| **Leave Management**    | Submit, view and approve leave requests               |
| **Payroll Summary**     | Payroll data overview                                 |
| **Roles & Departments** | Admin manages roles and department assignments        |
| **User Profile**        | View & edit personal profile                          |

---

## 🧩 Tech Stack

**Frontend**

* React.js / Next.js
* Material UI
* Axios

**Backend**

* Node.js
* Express
* MongoDB (or other DB)
* JWT Auth

---

## 🖼️ Screenshots

### Auth & Login

![Signin](https://i.ibb.co/4Rvzd4xw/signin.png)
![Admin Login](https://i.ibb.co/b5Gxhh5G/admin-login.png)

### Dashboards

![Admin Dashboard](https://i.ibb.co/BHxpXHnP/admindashboard.png)
![Employee Dashboard](https://i.ibb.co/VcKms86S/emp-Dashboard.png)

---

### Employee & Admin Features

#### Employee Views

![Attendance - Employee](https://i.ibb.co/TnY35HW/attendanceemp.png)
![Employee Leave](https://i.ibb.co/5hd2Yqzc/EMPLEAVE.png)
![User Profile](https://i.ibb.co/Kpj2DwtD/userprofile.png)

#### Admin Views

![Attendance Log](https://i.ibb.co/XZPksz3m/attendance-log.png)
![Leave Requests All Employees](https://i.ibb.co/FLc3cq4g/leaverequest-all-employee.png)
![Employees Details](https://i.ibb.co/RpYqn5Y8/employees-details.png)
![Add/Edit Employee](https://i.ibb.co/kV7cFFZm/add-employee-issue.png)
![Edit Employee from Admin](https://i.ibb.co/mrWTb7k2/edit-Emp-From-Admin.png)

---

### Organizational Views

![Departments with Employees](https://i.ibb.co/35mGmnww/departments-with-emp.png)
![Roles](https://i.ibb.co/vv6tmvxm/roles.png)
![Payroll](https://i.ibb.co/N6nrcmGB/payroll.png)
![Leave Summary](https://i.ibb.co/FNzvcGc/leave.png)

---

### Branding & People

![HRMS Branding](https://i.ibb.co/kVdm3dvv/hrms.png)
![Founder](https://i.ibb.co/nqv8YcM9/founder.png)
![Co-Founder](https://i.ibb.co/ZzPvRWDV/co-Founder.png)
![One Founder](https://i.ibb.co/LX3qdh4L/one-founder.png)


## 🛠️ Installation

### Backend

```bash
git clone <repo-url>
cd backend
npm install
npm run dev
```

Configure `.env`

```
PORT=8006
DB_URI=<your db uri>
JWT_SECRET=<your secret>
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8006
```

---

## ✔️ Usage

1. Visit `http://localhost:3000`
2. Register/Login as Admin/Employee
3. Configure roles & departments
4. Add employees
5. Use attendance and leave features

---

## 👤 Creator

**🚀 Created by:** *Gauri Bidwai*

---

## 💡 Open For Updates

This project is **open for improvements and collaboration** — feel free to connect and contribute!







<!-- 
https://i.ibb.co/NdWBMP7R/admin.png
https://i.ibb.co/LDxHtPVf/admin-login.png
https://i.ibb.co/7MTbTFp/co-Founder.png
https://i.ibb.co/DP9yGVSD/founder.png
https://i.ibb.co/GQfDf1KX/hr.png
https://i.ibb.co/PG0FtXz6/hrms.png
https://i.ibb.co/YTFbSttT/one-founder.png
https://i.ibb.co/0pzgf618/roles.png -->

<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<!-- ## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE). --> -->
