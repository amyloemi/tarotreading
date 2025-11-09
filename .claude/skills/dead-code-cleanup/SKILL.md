---
name: dead-code-cleanup
description: Identifies and removes dead code including unused functions, CSS rules, commented code, console logs, and debugging statements. Use this skill whenever the user requests a cleanup.
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Dead Code Cleanup Skill

## Purpose
This skill systematically identifies and removes dead code from the project to improve maintainability, reduce file size, and clean up the codebase.

## When to Use
Trigger this skill when:
- User explicitly calls for a "cleanup" or "clean up"
- After completing a major feature or refactoring
- Before deploying to production
- When preparing code for review

## Cleanup Categories

### 1. Console Logs and Debug Statements
Find and remove debugging code that shouldn't be in production:

```bash
# Find all console.log statements
grep -rn "console\.log" --include="*.js" --include="*.html" .

# Find console.error, console.warn, etc.
grep -rn "console\." --include="*.js" --include="*.html" .

# Find debugger statements
grep -rn "debugger" --include="*.js" --include="*.html" .

# Find alert() calls (often used for debugging)
grep -rn "alert\s*(" --include="*.js" --include="*.html" .
```

**Action**: Remove or comment out non-essential logging

### 2. Commented-Out Code Blocks
Find large blocks of commented code that should be removed:

```bash
# Find HTML comments with code
grep -rn "<!--.*-->" --include="*.html" .

# Find multi-line JavaScript comments
grep -rn "^[[:space:]]*//.*" --include="*.js" --include="*.html" .

# Find /* */ comment blocks
grep -rn "/\*" --include="*.js" --include="*.html" .
```

**Action**: Remove commented code blocks (git history preserves old code)

### 3. TODO and FIXME Comments
Identify and address or remove TODO items:

```bash
# Find TODO comments
grep -rn "TODO" --include="*.js" --include="*.html" --include="*.css" .

# Find FIXME comments
grep -rn "FIXME" --include="*.js" --include="*.html" --include="*.css" .

# Find HACK comments
grep -rn "HACK" --include="*.js" --include="*.html" --include="*.css" .

# Find XXX comments
grep -rn "XXX" --include="*.js" --include="*.html" --include="*.css" .
```

**Action**: Either complete the TODO or remove if no longer relevant

### 4. Unused JavaScript Functions
Identify functions that are never called:

```bash
# List all function definitions
grep -rn "function [a-zA-Z_][a-zA-Z0-9_]*" --include="*.js" --include="*.html" .

# For each function found, search for its usage
# Example for a function named "exampleFunc":
grep -rn "exampleFunc\s*(" --include="*.js" --include="*.html" .
```

**Action**: Remove functions with only one occurrence (the definition)

### 5. Unused CSS Rules
Find CSS selectors that don't match any HTML elements:

```bash
# List all CSS class definitions
grep -rn "\.[a-zA-Z_-][a-zA-Z0-9_-]*\s*{" --include="*.css" .

# For each class, search for usage in HTML
# Example for class "example-class":
grep -rn 'class="[^"]*example-class[^"]*"' --include="*.html" .

# Find ID selectors
grep -rn "#[a-zA-Z_-][a-zA-Z0-9_-]*\s*{" --include="*.css" .
```

**Action**: Remove CSS rules that have no matching HTML elements

### 6. Unused Variables
Identify declared but unused variables:

```bash
# Find variable declarations
grep -rn "var\s\+[a-zA-Z_]" --include="*.js" --include="*.html" .
grep -rn "let\s\+[a-zA-Z_]" --include="*.js" --include="*.html" .
grep -rn "const\s\+[a-zA-Z_]" --include="*.js" --include="*.html" .
```

**Action**: Remove unused variable declarations

### 7. Empty or Redundant Code
Find structural issues:

```bash
# Find empty functions
grep -rn "function.*{[[:space:]]*}" --include="*.js" --include="*.html" .

# Find empty event handlers
grep -rn "onclick=\"\"" --include="*.html" .

# Find duplicate whitespace/empty lines
grep -rn "^[[:space:]]*$" --include="*.js" --include="*.html" --include="*.css" . | uniq -c | sort -rn
```

**Action**: Remove empty functions, clean up excessive whitespace

### 8. Unused Images and Assets
Find unreferenced image files:

```bash
# List all images
find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" \)

# For each image, search for references
# Example for "example.png":
grep -rn "example\.png" .
```

**Action**: Remove unreferenced image files

## Cleanup Workflow

### Step 1: Analysis Phase
Run all grep commands to identify dead code candidates:

1. Create a comprehensive list of findings
2. Categorize by type (console logs, commented code, unused functions, etc.)
3. Verify each finding before removal

### Step 2: Verification Phase
For each potential dead code item:

1. Search entire codebase for references
2. Check if function/variable/class is used dynamically (eval, string references)
3. Confirm it's safe to remove

### Step 3: Removal Phase
Remove dead code in this order:

1. **Console logs and debugger statements** (safest)
2. **Commented-out code blocks** (safe if using git)
3. **TODO/FIXME comments** (review first)
4. **Unused functions** (verify no dynamic calls)
5. **Unused CSS rules** (verify no dynamic class additions)
6. **Unused variables** (check scope carefully)
7. **Unused assets** (backup first)

### Step 4: Testing Phase
After each category of removals:

1. Test the application in browser
2. Check for console errors
3. Verify all features still work
4. Run any automated tests

### Step 5: Commit Phase
Commit removals in logical groups:

```bash
git add .
git commit -m "Clean up: Remove console.log statements"

git add .
git commit -m "Clean up: Remove commented-out code"
```

## Safety Guidelines

### DO:
- ✅ Search entire codebase before removing anything
- ✅ Remove console.log statements (except critical error logging)
- ✅ Remove commented code blocks (git preserves history)
- ✅ Test after each major removal
- ✅ Commit changes in small, logical groups
- ✅ Keep a backup or work in a branch

### DON'T:
- ❌ Remove code without verifying it's unused
- ❌ Remove functions that might be called dynamically
- ❌ Remove CSS classes used by JavaScript
- ❌ Remove all TODO comments without reviewing them
- ❌ Make all changes in one big commit
- ❌ Skip testing after removals

## Example Cleanup Report

```
🧹 Dead Code Cleanup Report
=========================

Console Logs & Debug:
  ✓ Removed 12 console.log statements
  ✓ Removed 3 console.error statements
  ✓ Removed 1 debugger statement

Commented Code:
  ✓ Removed 8 commented code blocks
  ✓ Kept 2 comments explaining complex logic

TODOs:
  ✓ Completed 3 TODO items
  ✓ Removed 5 obsolete TODOs
  ⚠ Kept 2 TODOs that are still relevant

Unused Functions:
  ✓ Removed 4 unused helper functions
  ⚠ Kept 2 functions (may be used by external scripts)

Unused CSS:
  ✓ Removed 15 unused CSS rules
  ✓ Removed 3 unused class definitions

Variables:
  ✓ Removed 6 unused variable declarations

File Size Impact:
  Before: 245 KB
  After: 218 KB
  Saved: 27 KB (11% reduction)

Testing:
  ✅ All features tested and working
  ✅ No console errors
  ✅ Ready for commit
```

## Automated Detection Script

Create a quick analysis script:

```bash
#!/bin/bash
# analyze-dead-code.sh

echo "🔍 Analyzing Dead Code..."
echo ""

echo "Console Logs:"
grep -rn "console\." --include="*.js" --include="*.html" . | wc -l

echo "Commented Code Blocks:"
grep -rn "^[[:space:]]*//[^/]" --include="*.js" --include="*.html" . | wc -l

echo "TODO Comments:"
grep -rn "TODO\|FIXME\|HACK" --include="*.js" --include="*.html" --include="*.css" . | wc -l

echo "Debugger Statements:"
grep -rn "debugger" --include="*.js" --include="*.html" . | wc -l

echo ""
echo "✓ Analysis complete. Review findings above."
```

## Integration with Claude Workflow

When user says "clean up" or "cleanup":
1. **THIS SKILL ACTIVATES**
2. Run analysis phase
3. Present findings to user
4. Ask for confirmation before major removals
5. Execute cleanup in safe order
6. Test after each category
7. Generate cleanup report
8. Commit changes with descriptive messages

## Post-Cleanup Checklist

- [ ] All console.log statements removed (except intentional logging)
- [ ] Commented code blocks removed
- [ ] TODO comments addressed or removed
- [ ] Unused functions verified and removed
- [ ] Unused CSS rules removed
- [ ] Application tested and working
- [ ] Changes committed with clear messages
- [ ] File sizes reduced
- [ ] No new errors introduced
