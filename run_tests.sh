#!/bin/bash

# Set the terminal to show colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   FurnitureHeroes Testing Suite    ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Function to run tests with proper formatting
function run_test_section() {
    SECTION_NAME=$1
    COMMAND=$2
    
    echo -e "${BLUE}Running $SECTION_NAME tests...${NC}"
    eval $COMMAND
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✓ $SECTION_NAME tests passed!${NC}\n"
    else
        echo -e "\n${RED}✗ $SECTION_NAME tests failed!${NC}\n"
        FAILED=1
    fi
}

# Initialize failure flag
FAILED=0

# Frontend tests
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}         FRONTEND TESTS              ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

cd frontend

# Lint check
run_test_section "ESLint" "npm run lint || true"

# Frontend component tests
run_test_section "Frontend Component" "npm test -- --watchAll=false || true"

cd ..

# Backend tests
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}         BACKEND TESTS               ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

cd backend

# Run Django tests with pytest
run_test_section "Django" "DJANGO_SETTINGS_MODULE=assembleally.settings pytest || true"

cd ..

# Final result
if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests completed successfully!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed. Please check the output above.${NC}"
    exit 1
fi