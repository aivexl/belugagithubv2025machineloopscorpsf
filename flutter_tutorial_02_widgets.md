# Flutter Tutorial 02: Widgets Basics

## 1. StatelessWidget vs StatefulWidget

### StatelessWidget (Tidak berubah)
```dart
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App'),
      ),
      body: Center(
        child: Text('Hello Flutter!'),
      ),
    );
  }
}
```

### StatefulWidget (Bisa berubah)
```dart
class CounterPage extends StatefulWidget {
  @override
  _CounterPageState createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Counter App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
```

## 2. Basic Widgets

### Text Widgets
```dart
Text('Simple text'),
Text(
  'Styled text',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
),
Text.rich(
  TextSpan(
    text: 'Hello ',
    style: TextStyle(fontSize: 20),
    children: [
      TextSpan(
        text: 'World',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.red,
        ),
      ),
    ],
  ),
),
```

### Container & Box Decoration
```dart
Container(
  width: 200,
  height: 100,
  margin: EdgeInsets.all(16),
  padding: EdgeInsets.all(8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 2,
        blurRadius: 5,
        offset: Offset(0, 3),
      ),
    ],
  ),
  child: Text(
    'Styled Container',
    style: TextStyle(color: Colors.white),
  ),
),
```

### Row & Column
```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Icon(Icons.star, color: Colors.yellow),
    Text('Rating: 4.5'),
    Text('(120 reviews)'),
  ],
),

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Title', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
    SizedBox(height: 8),
    Text('Subtitle', style: TextStyle(fontSize: 16, color: Colors.grey)),
    SizedBox(height: 16),
    Text('Description...'),
  ],
),
```

### ListView
```dart
ListView(
  children: [
    ListTile(
      leading: Icon(Icons.star),
      title: Text('Item 1'),
      subtitle: Text('Description 1'),
      trailing: Icon(Icons.arrow_forward_ios),
      onTap: () {
        print('Item 1 tapped');
      },
    ),
    ListTile(
      leading: Icon(Icons.favorite),
      title: Text('Item 2'),
      subtitle: Text('Description 2'),
      trailing: Icon(Icons.arrow_forward_ios),
      onTap: () {
        print('Item 2 tapped');
      },
    ),
  ],
),

// ListView.builder untuk data dinamis
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].title),
      subtitle: Text(items[index].description),
    );
  },
),
```

## 3. Buttons & Interactive Widgets

### Buttons
```dart
ElevatedButton(
  onPressed: () {
    print('Button pressed');
  },
  child: Text('Elevated Button'),
),

TextButton(
  onPressed: () {
    print('Text button pressed');
  },
  child: Text('Text Button'),
),

IconButton(
  onPressed: () {
    print('Icon button pressed');
  },
  icon: Icon(Icons.favorite),
),

FloatingActionButton(
  onPressed: () {
    print('FAB pressed');
  },
  child: Icon(Icons.add),
),
```

### Input Fields
```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Enter your name',
    hintText: 'John Doe',
    border: OutlineInputBorder(),
    prefixIcon: Icon(Icons.person),
  ),
  onChanged: (value) {
    print('Text changed: $value');
  },
),

TextFormField(
  decoration: InputDecoration(
    labelText: 'Email',
    border: OutlineInputBorder(),
  ),
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    }
    return null;
  },
),
```

## 4. Layout Widgets

### Stack (Overlay widgets)
```dart
Stack(
  children: [
    Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
    Positioned(
      top: 20,
      left: 20,
      child: Container(
        width: 50,
        height: 50,
        color: Colors.red,
      ),
    ),
    Positioned(
      bottom: 20,
      right: 20,
      child: Container(
        width: 50,
        height: 50,
        color: Colors.green,
      ),
    ),
  ],
),
```

### Expanded & Flexible
```dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(
        height: 100,
        color: Colors.red,
        child: Center(child: Text('Flex 2')),
      ),
    ),
    Expanded(
      flex: 1,
      child: Container(
        height: 100,
        color: Colors.blue,
        child: Center(child: Text('Flex 1')),
      ),
    ),
  ],
),
```

## 5. Navigation

### Basic Navigation
```dart
// Navigate to new page
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);

// Navigate and replace current page
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);

// Go back
Navigator.pop(context);

// Pass data to next page
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailPage(data: 'Hello from first page'),
  ),
);
```

## Latihan:
1. Buat app dengan counter (StatefulWidget)
2. Buat list view dengan crypto data
3. Buat form input untuk search crypto
4. Implement navigation antar halaman 