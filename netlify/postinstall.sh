#!/bin/bash

# Install Prisma globally
npm install -g prisma

# Generate Prisma client
npx prisma generate

echo "Prisma client generated successfully" 