# Flutter Tutorial 01: Dart Language Basics

## 1. Variables dan Data Types

```dart
// Numbers
int age = 25;
double price = 19.99;

// Strings
String name = "John Doe";
String message = 'Hello World';

// Booleans
bool isActive = true;
bool isLoggedIn = false;

// Lists (Arrays)
List<String> fruits = ['apple', 'banana', 'orange'];
List<int> numbers = [1, 2, 3, 4, 5];

// Maps (Objects/Dictionaries)
Map<String, dynamic> user = {
  'name': 'John',
  'age': 25,
  'email': 'john@example.com'
};

// Dynamic (bisa berubah tipe data)
dynamic variable = "Hello";
variable = 42; // OK
variable = true; // OK
```

## 2. Functions

```dart
// Basic function
void sayHello() {
  print("Hello World!");
}

// Function with parameters
void greet(String name) {
  print("Hello $name!");
}

// Function with return value
int add(int a, int b) {
  return a + b;
}

// Arrow function (short syntax)
int multiply(int a, int b) => a * b;

// Function with optional parameters
void printInfo(String name, {int? age, String? city}) {
  print("Name: $name");
  if (age != null) print("Age: $age");
  if (city != null) print("City: $city");
}

// Usage
printInfo("John", age: 25, city: "Jakarta");
```

## 3. Classes dan Objects

```dart
class Person {
  // Properties
  String name;
  int age;
  
  // Constructor
  Person(this.name, this.age);
  
  // Named constructor
  Person.guest() : name = "Guest", age = 0;
  
  // Method
  void introduce() {
    print("Hi, I'm $name and I'm $age years old");
  }
  
  // Getter
  String get info => "$name ($age years old)";
  
  // Setter
  set setAge(int newAge) {
    if (newAge >= 0) {
      age = newAge;
    }
  }
}

// Usage
Person person = Person("John", 25);
person.introduce();
print(person.info);

Person guest = Person.guest();
```

## 4. Null Safety

```dart
// Non-nullable (tidak bisa null)
String name = "John"; // OK
String name2 = null; // ERROR!

// Nullable (bisa null)
String? nullableName = "John"; // OK
String? nullableName2 = null; // OK

// Null-aware operators
String? name;
String displayName = name ?? "Unknown"; // Default value jika null

// Null-aware access
String? text;
int length = text?.length ?? 0; // Safe access

// Null assertion (hati-hati!)
String? name;
String displayName = name!; // Crash jika null
```

## 5. Async Programming

```dart
// Future (Promise-like)
Future<String> fetchData() async {
  // Simulate API call
  await Future.delayed(Duration(seconds: 2));
  return "Data loaded!";
}

// Async function usage
void loadData() async {
  print("Loading...");
  String result = await fetchData();
  print(result);
}

// Error handling
Future<String> fetchDataWithError() async {
  try {
    await Future.delayed(Duration(seconds: 1));
    throw Exception("Network error");
  } catch (e) {
    return "Error: $e";
  }
}
```

## 6. Collections

```dart
// List operations
List<String> fruits = ['apple', 'banana'];
fruits.add('orange');
fruits.remove('banana');
fruits.contains('apple'); // true

// Map operations
Map<String, int> scores = {'John': 100, 'Jane': 95};
scores['Bob'] = 88;
scores.remove('John');
scores.containsKey('Jane'); // true

// Set (unique values)
Set<String> uniqueFruits = {'apple', 'banana', 'apple'};
print(uniqueFruits); // {apple, banana}
```

## Latihan:
1. Buat class `Crypto` dengan properties: name, price, change
2. Buat function untuk menghitung total portfolio
3. Buat async function untuk fetch crypto data
4. Implement null safety untuk semua data 