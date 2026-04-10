#!/usr/bin/env node

import db from "./db.json" with { type: "json" };
import { writeFile } from "fs/promises";
// console.log(process.argv[2]);
// please do not give me any suggestion i have to do my self
// task add
async function taskAdd(task) {
  if (!task) {
    console.warn("please put your Task");
  }
  const newTask = {
    id: db.length + 1,
    description: task,
    status: "todo",
    createdAt: new Date(),
  };
  db.push(newTask);
  try {
    await writeFile("./db.json", JSON.stringify(db));
    console.log(`Task Added successfully (${newTask.id})`);
  } catch (err) {
    console.error(err);
  }
}

async function updateTask(id, newTask) {
  if (!id) {
    console.warn("please Enter your task id");
  }
  if (!newTask) {
    console.warn("Please Enter New task that you want to update");
  }
  // this is. bad approach
  //   const filterTasks = db.filter((task) => task.id == id);
  //   filterTasks[0].description = newTask;
  //   db[id - 1] = filterTasks[0];
  // this also bad approach caz we are depend on. id if id is serial then it might ok
  //   db[id - 1].description = newTask;
  // better approach
  //   const findData = db.find((task) => task.id == id);
  //   findData.description = newTask;

  // optimul approach
  const findIndex = db.findIndex((task) => task.id == id);
  if (findIndex === -1) {
    console.warn("Task is not found");
  }
  db[findIndex] = {
    ...db[findIndex],
    description: newTask,
    updatedAt: new Date(),
  };
  try {
    await writeFile("./db.json", JSON.stringify(db));
    console.log(`Task Updated successfully (${id})`);
  } catch (err) {
    console.error(err);
  }
}

async function deleteTask(id) {
  if (!id) {
    console.warn("Please Enter id for delete");
  }
  const index = db.findIndex((task) => task.id == id);
  if (index === -1) {
    console.warn("Task is not found");
  }
  db.splice(index, 1);
  try {
    await writeFile("./db.json", JSON.stringify(db));
    console.log("delete successfully", db[index].id);
  } catch (err) {
    console.error(err);
  }
}

async function changeStatus(status, id) {
  if (!status && !id) {
    console.log("Please Enter valid details");
  }
  const index = db.findIndex((task) => task.id === id);
  if (status === "mark-in-progress") {
    db[index] = { ...db[index], status: "mark-in-progress" };
  } else if (status === "mark-done") {
    db[index] = { ...db[index], status: "mark-done" };
  } else {
    console.log("please Enter right status name");
  }
  try {
    await writeFile("./db.json", JSON.stringify(db));
    console.log("Successfully change the status");
  } catch (err) {
    console.warn(err);
  }
}

function filterStatus(status) {
  return db.filter((task) => task.status === status);
}

function listByStatus(status) {
  if (!status) {
    console.log(`Id | Description | Status | createdAt | updatedAt`);
    db.forEach((task) => {
      console.log(
        `${task.id} | ${task.description} | ${task.status} | ${task.createdAt} | ${task.updatedAt}`,
      );
    });
    return;
  }

  let filterData = [];
  if (status === "done") {
    filterData = filterStatus(status);
  } else if (status === "in-progress") {
    filterData = filterStatus(status);
  } else if (status === "todo") {
    filterData = filterStatus(status);
  } else {
    console.warn("Please Enter correct status");
  }
  console.log(`Id | Description | Status | createdAt | updatedAt`);
  filterData.forEach((task) => {
    console.log(
      `${task.id} | ${task.description} | ${task.status} | ${task.createdAt} | ${task.updatedAt}`,
    );
  });
}

function main() {
  const action = process.argv[2];
  switch (action) {
    case "add":
      taskAdd(process.argv[3]);
      break;
    case "update":
      updateTask(parseInt(process.argv[3]), process.argv[4]);
      break;
    case "delete":
      deleteTask(parseInt(process.argv[3]));
      break;
    case "mark-in-progress":
      changeStatus(process.argv[3], parseInt(process.argv[4]));
      break;
    case "mark-done":
      changeStatus(process.argv[3], parseInt(process.argv[4]));
      break;
    case "list":
      listByStatus(process.argv[3]);
      break;
    default:
      console.warn("please type right command");
  }
}

main();
