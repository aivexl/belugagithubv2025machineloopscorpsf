# Flutter Tutorial 03: Praktik - Crypto App Sederhana

## Project Structure
```
lib/
├── main.dart
├── models/
│   └── crypto.dart
├── screens/
│   ├── home_screen.dart
│   ├── detail_screen.dart
│   └── search_screen.dart
├── widgets/
│   ├── crypto_card.dart
│   └── price_chart.dart
└── services/
    └── api_service.dart
```

## 1. Models (lib/models/crypto.dart)

```dart
class Crypto {
  final String id;
  final String name;
  final String symbol;
  final double price;
  final double change24h;
  final String imageUrl;

  Crypto({
    required this.id,
    required this.name,
    required this.symbol,
    required this.price,
    required this.change24h,
    required this.imageUrl,
  });

  factory Crypto.fromJson(Map<String, dynamic> json) {
    return Crypto(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      symbol: json['symbol'] ?? '',
      price: (json['current_price'] ?? 0).toDouble(),
      change24h: (json['price_change_percentage_24h'] ?? 0).toDouble(),
      imageUrl: json['image'] ?? '',
    );
  }
}
```

## 2. API Service (lib/services/api_service.dart)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/crypto.dart';

class ApiService {
  static const String baseUrl = 'https://api.coingecko.com/api/v3';

  static Future<List<Crypto>> getTopCryptos() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Crypto.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load cryptos');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Crypto> getCryptoDetail(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/coins/$id'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Crypto.fromJson(data);
      } else {
        throw Exception('Failed to load crypto detail');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
```

## 3. Custom Widgets (lib/widgets/crypto_card.dart)

```dart
import 'package:flutter/material.dart';
import '../models/crypto.dart';

class CryptoCard extends StatelessWidget {
  final Crypto crypto;
  final VoidCallback? onTap;

  const CryptoCard({
    Key? key,
    required this.crypto,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isPositive = crypto.change24h >= 0;
    final changeColor = isPositive ? Colors.green : Colors.red;
    final changeIcon = isPositive ? Icons.trending_up : Icons.trending_down;

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              // Crypto Icon
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(25),
                  color: Colors.grey[200],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(25),
                  child: Image.network(
                    crypto.imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Icon(Icons.currency_bitcoin, size: 30);
                    },
                  ),
                ),
              ),
              SizedBox(width: 16),
              
              // Crypto Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      crypto.name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      crypto.symbol.toUpperCase(),
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              
              // Price & Change
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '\$${crypto.price.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        changeIcon,
                        size: 16,
                        color: changeColor,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${crypto.change24h.toStringAsFixed(2)}%',
                        style: TextStyle(
                          fontSize: 14,
                          color: changeColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 4. Home Screen (lib/screens/home_screen.dart)

```dart
import 'package:flutter/material.dart';
import '../models/crypto.dart';
import '../services/api_service.dart';
import '../widgets/crypto_card.dart';
import 'detail_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Crypto> cryptos = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    loadCryptos();
  }

  Future<void> loadCryptos() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });

      final data = await ApiService.getTopCryptos();
      setState(() {
        cryptos = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Crypto Tracker'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: loadCryptos,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: loadCryptos,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Loading cryptos...'),
          ],
        ),
      );
    }

    if (error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error, size: 64, color: Colors.red),
            SizedBox(height: 16),
            Text('Error: $error'),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: loadCryptos,
              child: Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (cryptos.isEmpty) {
      return Center(
        child: Text('No cryptos found'),
      );
    }

    return ListView.builder(
      itemCount: cryptos.length,
      itemBuilder: (context, index) {
        final crypto = cryptos[index];
        return CryptoCard(
          crypto: crypto,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => DetailScreen(crypto: crypto),
              ),
            );
          },
        );
      },
    );
  }
}
```

## 5. Detail Screen (lib/screens/detail_screen.dart)

```dart
import 'package:flutter/material.dart';
import '../models/crypto.dart';

class DetailScreen extends StatelessWidget {
  final Crypto crypto;

  const DetailScreen({Key? key, required this.crypto}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isPositive = crypto.change24h >= 0;
    final changeColor = isPositive ? Colors.green : Colors.red;

    return Scaffold(
      appBar: AppBar(
        title: Text(crypto.name),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Center(
              child: Column(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(50),
                      color: Colors.grey[200],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(50),
                      child: Image.network(
                        crypto.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(Icons.currency_bitcoin, size: 50);
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    crypto.name,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    crypto.symbol.toUpperCase(),
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 32),
            
            // Price Info
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Current Price',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      '\$${crypto.price.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // 24h Change
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '24h Change',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    Row(
                      children: [
                        Icon(
                          isPositive ? Icons.trending_up : Icons.trending_down,
                          color: changeColor,
                        ),
                        SizedBox(width: 8),
                        Text(
                          '${crypto.change24h.toStringAsFixed(2)}%',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: changeColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 32),
            
            // Additional Info
            Text(
              'About ${crypto.name}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'This is a placeholder description for ${crypto.name}. '
              'In a real app, you would fetch detailed information about '
              'the cryptocurrency from the API.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 6. Main App (lib/main.dart)

```dart
import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Crypto Tracker',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomeScreen(),
    );
  }
}
```

## 7. Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.0
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
```

## Cara Menjalankan:

1. **Install dependencies:**
   ```bash
   flutter pub get
   ```

2. **Run app:**
   ```bash
   flutter run
   ```

## Fitur yang Dibuat:
- ✅ List crypto dengan real-time data
- ✅ Detail page untuk setiap crypto
- ✅ Pull-to-refresh
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Navigation antar halaman

## Latihan Lanjutan:
1. Tambahkan search functionality
2. Implement favorite/watchlist
3. Tambahkan charts untuk price history
4. Implement dark mode
5. Tambahkan notifications untuk price alerts 