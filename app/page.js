"use client";

import { Box, Stack, Typography, Button, Modal, TextField, ThemeProvider, createTheme, Select, MenuItem, Chip, IconButton, Tooltip } from "@mui/material";
import { Search, Info, Warning } from '@mui/icons-material';
import { firestore } from "@/firebase";
import { collection, query, doc, getDocs, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
});

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Grains', 'Protein', 'Snacks', 'Beverages', 'Other'];

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Other');
  const [itemExpiration, setItemExpiration] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDetailsOpen = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };
  const handleDetailsClose = () => setDetailsOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      pantryList.push({ 
        "name": doc.id, 
        "count": data.count || 0,
        "category": data.category || 'Uncategorized',
        "expiration": data.expiration || ''
      });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    if (!item.trim()) return;
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const {count = 0, category = 'Uncategorized', expiration = ''} = docSnap.data();
      await setDoc(docRef, {count: count + 1, category, expiration});
    } else {
      await setDoc(docRef, { count: 1, category: itemCategory, expiration: itemExpiration });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
      const {count = 0, category = 'Uncategorized', expiration = ''} = docSnap.data();
      if (count <= 1){
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {count : count - 1, category, expiration});
      }
    }
    await updatePantry();
  };

  const filteredPantry = pantry.filter(item => 
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLowStock = (count) => typeof count === 'number' && count <= 2;
  const isExpiringSoon = (expiration) => {
    if (!expiration) return false;
    const today = new Date();
    const expirationDate = new Date(expiration);
    if (isNaN(expirationDate.getTime())) return false; // Invalid date
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 4,
          bgcolor: 'background.default',
          color: 'text.primary',
          padding: 3,
        }}
      >
        <Typography variant="h2" fontWeight="bold" color="primary">
          Pantry Manager
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: '800px', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            sx={{
              fontSize: '1.2rem',
              padding: '10px 30px',
              borderRadius: '25px',
            }}
          >
            Add Item
          </Button>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Box>

        <Box 
          sx={{
            width: '100%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <Box
            sx={{
              padding: 3,
              bgcolor: 'primary.main',
              color: 'background.default',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Pantry Items
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ padding: 2, maxHeight: '600px', overflow: 'auto' }}>
            {filteredPantry.map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: 'background.paper',
                  padding: 2,
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {item.name ? (item.name.charAt(0).toUpperCase() + item.name.slice(1)) : 'Unnamed Item'}
                  </Typography>
                  <Chip label={item.category || 'Uncategorized'} size="small" sx={{ marginTop: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Quantity: {item.count || 0}
                  </Typography>
                  {isLowStock(item.count) && (
                    <Tooltip title="Low stock">
                      <Warning color="error" />
                    </Tooltip>
                  )}
                  {isExpiringSoon(item.expiration) && (
                    <Tooltip title="Expiring soon">
                      <Warning color="warning" />
                    </Tooltip>
                  )}
                  <IconButton onClick={() => handleDetailsOpen(item)}>
                    <Info />
                  </IconButton>
                  <Button 
                    variant="outlined" 
                    color="secondary"
                    onClick={() => removeItem(item.name)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '15px',
              boxShadow: 24,
              p: 4,
              gap: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography id="modal-modal-title" variant="h5" fontWeight="bold">
              Add Item
            </Typography>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            <TextField
              label="Expiration Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={itemExpiration}
              onChange={(e) => setItemExpiration(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                setItemCategory('Other');
                setItemExpiration('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Box>
        </Modal>

        <Modal
          open={detailsOpen}
          onClose={handleDetailsClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '15px',
              boxShadow: 24,
              p: 4,
              gap: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography id="modal-modal-title" variant="h5" fontWeight="bold">
              Item Details
            </Typography>
            {selectedItem && (
              <>
                <Typography variant="h6">{selectedItem.name || 'Unnamed Item'}</Typography>
                <Typography>Category: {selectedItem.category || 'Uncategorized'}</Typography>
                <Typography>Quantity: {selectedItem.count || 0}</Typography>
                <Typography>Expiration Date: {selectedItem.expiration || 'Not set'}</Typography>
              </>
            )}
            <Button variant="contained" onClick={handleDetailsClose}>Close</Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}