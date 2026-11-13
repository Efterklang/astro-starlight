---
title: go comment
---

# Go Doc Comment Special Syntax

Go's documentation comments (`godoc`) support several special syntax features to create rich, navigable documentation. IDEs and tools like `go doc` parse these comments to generate HTML pages or provide interactive tooltips.

Here are some of the most common special syntax features:

## 1. Paragraphs

Paragraphs are separated by one or more blank lines, just like in standard Markdown.

```go
// Package models defines the data structures for the application.
//
// This is a second paragraph providing more details about the package.
package models
```

## 2. Linking to Identifiers

This is a powerful feature for creating navigable documentation.

### Within the Same Package

To link to another type, function, or variable within the same package, enclose its name in square brackets `[]`.

```go
// UserReferral records the invitation relationship between two [User] entities.
type UserReferral struct {
    // ...
}
```

### To Other Packages

To link to an identifier in another package, use the `[pkg.Identifier]` or `[pkg/path.Identifier]` format.

```go
// PrintUser prints user details using [fmt.Println].
// It formats the output according to the documentation in [text/tabwriter].
func PrintUser(u *User) {
    // ...
}
```

## 3. Code Blocks

To format text as a pre-formatted code block, indent it with a tab or spaces. This is useful for showing example code.

```go
// GetUser retrieves a user by their ID.
//
// Example usage:
//
//  user, err := GetUser(123)
//  if err != nil {
//      log.Fatal(err)
//  }
//
func GetUser(id uint) (*User, error) {
    // ...
}
```

## 4. Headings

A line that starts with `#` and is followed by a space is treated as a heading. While `godoc` supports this, its usage is less common in typical struct/function comments and more suited for package-level documentation.

```go
// Package users provides functionality for user management.
//
// # Overview
//
// This section provides a general overview of the package.
//
// # Authentication
//
// This section details the authentication mechanisms.
package users
```

## 5. Lists

You can create bulleted or numbered lists.

### Bulleted Lists

Start a line with `*`, `+`, or `-`. Subsequent lines for the same list item should be indented.

```go
// User struct contains several fields:
//  - UserName: The user's public display name.
//  - Email: The user's primary email address for login and notifications.
//  - PasswordHash: The securely hashed password.
type User struct {
    // ...
}
```

### Numbered Lists

Start a line with a number followed by a period and a space.

```go
// To create a new user, follow these steps:
//
// 1. Create a new User struct.
// 2. Hash the desired password.
// 3. Call the CreateUser function.
func CreateUser(u *User) error {
    // ...
}
```

## 6. Deprecation Notices

To mark a function, type, or variable as deprecated, start a comment line with `Deprecated:`. The toolchain will recognize this and may issue warnings if the deprecated identifier is used.

```go
// Deprecated: Use NewAdvancedFeature instead.
func OldFeature() {
    // ...
}
```

## 7. BUG Markers

A special convention is to use `BUG(identifier):` at the beginning of a comment to note a known bug. The `go doc` tool can display these. The identifier is usually a name or issue tracker ID.

```go
// BUG(gopher): This function panics if the input is negative.
func Process(value int) {
    // ...
}
```
