# COLmmunity chat bot v1.0.0

## About

COLmmunity chat bot is a bot created for Complexity's community nights. It's primary purpose is to facilitate community night games such as faction wars, zombies, and protect the president!

## FACTION Commands

| command       | description                                                               | arguments                     | permissions |
| ------------- | ------------------------------------------------------------------------- | ----------------------------- | ----------- |
| /faction      | creates factions                                                          | number of factions (int)      | admin       |
| /assign       | assigns a specific user to a specific faction                             | user(obj), faction name (str) | admin       |
| /unassign     | unassigns a user from all factions                                        | user (obj)                    | admin       |
| /assign_all   | assigns the maximumum number of users from queue to a faction             |                               | admin       |
| /unassign_all | clears all faction assignments, doesn't clear queue                       |                               |             |
| /reset        | resets all factions and queue                                             |                               |             |
| /clear_queue  | clears queue, but not faction assignments                                 |                               |             |
| /start_war    | locks faction assignments, assigns faction roles, sends out voice invites |                               |             |
|               |                                                                           |                               |             |
|               |                                                                           |                               |             |

## USER Commands

| command         | description                             | arguments | permissions |
| --------------- | --------------------------------------- | --------- | ----------- |
| /join           | command to join a faction war           |           | user        |
| /print_factions | prints all current factions assignments |           | users       |
|                 |                                         |           |             |
|                 |                                         |           |             |
|                 |                                         |           |             |
|                 |                                         |           |             |
|                 |                                         |           |             |
|                 |                                         |           |             |
|                 |                                         |           |             |

## TO-DO // dev notes

1. Please note that the current version 1.0.0 relies entirely on app cache and has no persistent database. There does exist a file for db.js that contains dynamoDB methods and pushes the items that exist in app cache to a DB. We plan to move from app cache to a cloud-based DB at a future version.
1.
