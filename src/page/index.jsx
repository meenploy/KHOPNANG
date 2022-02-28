import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { fetchData, insertData, updateData, deleteData } from "../service/action"
import GoogleAuth from '../components/GoogleAuth'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';
import FileUpload from '@mui/icons-material/FileUpload';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import LocalBar from '@mui/icons-material/LocalBar';
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#eadbc8',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const styleT = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  textAlign:"center"
};

const Item = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  backgroundColor: "transparent",
}));

const Input = styled('input')({
  display: 'none',
});

export default function Index() {
  const [dense, setDense] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);

  const [name, setName] = useState();
  const [key, setKey] = useState();
  const image = useRef();

  const [gerne, setGerne] = React.useState('');
  const [rate, setRate] = React.useState('');
  const [type, setType] = React.useState('');
  const [img, setImg] = React.useState('');
  const [data, setData] = useState([]);
  const isSignedIn = useSelector(state => state.auth.isSignedIn)
  const profile = useSelector(state => state.auth.profile)

  var uid = null;
  try {
    uid = profile["userId"];
  } catch (e) { }

  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const editClose = () => { setEdit(false); }
  const viewClose = () => { setView(false); }

  const viewOpen = (item) => {
    setName(item.name);
    setRate(item.rate);
    setType(item.gerne);
    setImg(item.image);
    setView(true);
  }

  const editOpen = (item) => {
    setName(item.name);
    setRate(item.rate);
    setType(item.gerne);
    setKey(item.key);
    setEdit(true);
  }


  const handleUpload = (e) => {
    const blah = document.getElementById('blah');
    const imgup = document.getElementById('imgup');
    let [img] = e.target.files;
    let Read = new FileReader();
    Read.onload = (e) => {
      blah.src = e.target.result;
      imgup.style.display = "block";
    }
    Read.readAsDataURL(img);
  };

  const search = (e) => {
    fetchData().then((data) => setData(data.filter(s => { return s.gerne.includes(e) })))
    setGerne(e)
  }

  useEffect(() => { fetchData().then((data) => setData(data)) }, [])

  //* Function Database //
  const uploadData = () => {
    setOpen(false);
    let reafer = new FileReader();
    reafer.onload = (e) => {
      let payload = {
        uid: uid,
        name: name,
        gerne: type,
        rate: rate,
        image: e.target.result
      }
      console.log(payload)
      insertData(payload).then(data => setData(data));
    }
    reafer.readAsDataURL(image.current.files[0]);
  }

  const removeItem = (key) => {
    deleteData(key).then((data) => setData(data));
  }

  const upData = () => {
    setEdit(false);
    let payload = {
      name: name,
      gerne: type,
      rate: rate,
    }
    console.log(payload)
    updateData(key, payload).then((data) => setData(data));
  }
  //* Function Database //

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "#3D4490" }}>
          <Toolbar>
            <Typography variant="h6" style={{cursor:"pointer"}} component="div" onClick={e=>window.location.reload()} sx={{ flexGrow: 1 }}>
              KHOPNANG
            </Typography>
            {isSignedIn ? <Button variant="contained" color="warning" sx={{ mr: "1rem" }} onClick={handleOpen}>Add</Button> : <></>}
            <GoogleAuth />
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ width: "35%", m: "auto", mt: '1rem', mb: "1rem", boxShadow: 2 }}>
        <FormControl fullWidth size='small' >
          <InputLabel id="demo-simple-select-label">ประเภทหนัง</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gerne}
            style={{ backgroundColor: "#fff" }}
            label="ประเภทหนัง"
            onChange={e => search(e.target.value)}
          >
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Adventure">Adventure</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Crime">Crime</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ImageListItem sx={{ width: "100%", m: 'auto', mt: 1 }} cols={4}>
        {data.slice(0).reverse().map((item) =>
          <ImageListItem key={item.key} sx={{ m: 0.5 }}>
            <img
              src={`${item.image}`}
              srcSet={`${item.image}`}
              alt={item.name}
              id="imglist"
              loading="lazy"
            />
            <ImageListItemBar
              title={item.name}
              subtitle={item.rate}
              actionIcon={
                <>
                  <IconButton onClick={e => viewOpen(item)}>
                    <RemoveRedEyeIcon sx={{ color: '#fff' }} />
                  </IconButton>
                  {uid === item.uid ? <><IconButton onClick={e => editOpen(item)}>
                    <ModeEditIcon sx={{ color: '#fff' }} />
                  </IconButton>
                    <IconButton onClick={e => removeItem(item.key)}>
                      <DeleteIcon sx={{ color: '#fff' }} />
                    </IconButton></> : <></>}

                </>
              }
            />
          </ImageListItem>
        )}
      </ImageListItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <h2 sx={{ color: 'text.secondary', display: 'inline', fontSize: 14, mx: 0.5 }} id="parent-modal-title">เพิ่มหนัง</h2>
          <Item id="imgup"><img id="blah" src="#" alt="your image" width="100%" height="100%" /></Item>
          <TextField id="outlined-basic" label="ชื่อ" variant="outlined" onChange={e => { setName(e.target.value) }} size="small" sx={{ mt: 1, width: "100%" }} />
          <Box sx={{ width: "100%", m: "auto", mt: '1rem', mb: "1rem", boxShadow: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">ประเภทหนัง</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="ประเภทหนัง"
                onChange={e => setType(e.target.value)}
              >
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Crime">Crime</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Fantasy">Fantasy</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", m: "auto", mt: '1rem', mb: "1rem", boxShadow: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">คะแนนหนัง</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={rate}
                label="คะแนนหนัง"
                onChange={e => setRate(e.target.value)}
              >
                <MenuItem value="⭐">⭐</MenuItem>
                <MenuItem value="⭐⭐">⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐">⭐⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐⭐">⭐⭐⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleUpload} ref={image} />
            <Button
              variant="contained"
              color='secondary'
              size="small"
              sx={{ width: '100%', mt: 1 }}
              startIcon={<FileUpload />}
              component="span">
              Upload Image
            </Button>
          </label>
          <Button variant="contained" sx={{ mt: 1, width: "100%" }} onClick={e => { uploadData() }}>บันทึก</Button>
        </Box>
      </Modal>
      <Modal
        open={edit}
        onClose={editClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <h2 id="parent-modal-title">แก้ไขหนัง</h2>
          <TextField id="outlined-basic" label="ชื่อ" variant="outlined" value={name} onChange={e => { setName(e.target.value) }} size="small" sx={{ width: "100%" }} />
          <Box sx={{ width: "100%", m: "auto", mt: '1rem', mb: "1rem", boxShadow: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">ประเภทหนัง</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="ประเภทหนัง"
                onChange={e => setType(e.target.value)}
              >
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Crime">Crime</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Fantasy">Fantasy</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", m: "auto", mt: '1rem', mb: "1rem", boxShadow: 2 }}>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">คะแนนหนัง</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={rate}
                label="คะแนนหนัง"
                onChange={e => setRate(e.target.value)}
              >
                <MenuItem value="⭐">⭐</MenuItem>
                <MenuItem value="⭐⭐">⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐">⭐⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐⭐">⭐⭐⭐⭐</MenuItem>
                <MenuItem value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" sx={{ mt: 1, width: "100%" }} onClick={e => { upData() }}>บันทึก</Button>
        </Box>
      </Modal>
      <Modal
        open={view}
        onClose={viewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleT}>
          <Item>
            <img src={img} className='shadow-dreamy' id="imgshow" />
          </Item>
          <Typography id="modal-modal-title" variant="h4" sx={{mt:"1rem"}} component="h2">
              {name}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
              {type}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
              {rate}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
