# Introductions

This is a Front-End test project for a [job](https://ddfinance.com/jobs/dev/) opening at [DDFinance](https://ddfinance.com/). It is a user interface project based off of [Angular](https://angular.dev/) a TypeScript-based free and open-source single-page web application framework.

## Table Of Contents

- [Introduction](#introductions)
  - [Table Of Contents](#table-of-contents)
- [Project Properties](#project-propertise)
  - [Pages](#pages)
  - [Angular Version](#angular-version)
  - [Data Table](#data-table)
  - [Input Forms](#input-forms)
  - [Responsive Design](#responsive-design)
- [Local Setup](#local-setup)

# Project Propertise

## Angular Version

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Pages

This front-end application boasts three pages coneniently and efficiently routed. The pages include a home dashboard that loads a list of policies to a table, a form for adding a policy and lastly a policy item page for displaying and updating a policy item. Together they fully capture the requests as directed from the project statement.

## Data Table

The apps home page loads to a data table that is the product of [Angular Material](https://material.angular.io/components/table/overview) displaying a list of policies on which the user can perform various opperations.

## Input Forms

The required input forms for adding new policies and performing required updates on the available have been built by [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms).

## Responsive Design

The responsive properties of the appliction are provide for by [Bootstrap](https://getbootstrap.com/) row and column classes

## Notifiction

The convenient notifictions that offer users meaningfull alarts during their add, update and delete operations on the data are provided for by [SweetAlart2](https://sweetalert2.github.io/)

# Local Setup

The first and usual step after downloading the project and loading it on your favorite programing environment is to run `npm install` to get all the project dependencies. After that is done, you can run `ng serve` for a dev server then naviagte to `http://localhost:4200/` on you browser for the UI interaction. Assuming the back-end is set up and running on `http://localhost:57679` the app should be fully functional. If the back-end is not on the specified route, then the route should be updated on the `policy.service.ts` file in the `src/app/core/services` folder.


