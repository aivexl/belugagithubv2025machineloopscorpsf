// Script untuk menambahkan coin tags ke artikel yang sudah ada
// Jalankan di Vision plugin Sanity Studio

// Query untuk menambahkan Bitcoin coin tag ke artikel test12
[
  {
    "_type": "article",
    "_id": "175866b0-580c-4ad8-a0cf-6d797c256250", // ID artikel test12
    "coinTags": [
      {
        "_type": "reference",
        "_ref": "COIN_TAG_ID_BITCOIN" // Ganti dengan ID coin tag Bitcoin yang sudah dibuat
      }
    ]
  }
]

// Atau gunakan query ini untuk update artikel dengan coin tags:
// *[_type == "article" && slug.current == "test12"][0] {
//   ...,
//   "coinTags": [
//     {
//       "_type": "reference", 
//       "_ref": "COIN_TAG_ID_BITCOIN"
//     }
//   ]
// }


























