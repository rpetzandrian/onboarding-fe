import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Navbar,
  Row,
} from "react-bootstrap";
import CustomHead from "../components/CustomHead";
import axios from "axios";
import Image from "next/image";

function Home({ posts }) {
  const [product, setProduct] = useState(posts);
  const [selectedItem, setSelectedItem] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [formState, setFormState] = useState("add");
  const [updated, setUpdated] = useState(true);

  const getProduct = () => {
    axios({
      method: "GET",
      url: "http://localhost:8000",
    })
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const deleteProduct = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:8000/${id}`,
    })
      .then((res) => {
        setUpdated(!updated);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const addProduct = (data) => {
    axios({
      method: "POST",
      url: `http://localhost:8000`,
      data: data,
    })
      .then((res) => {
        setUpdated(!updated);
        setFormData({
          name: "",
          price: "",
          description: "",
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const updateProduct = (id, data) => {
    axios({
      method: "PATCH",
      url: `http://localhost:8000/${id}`,
      data: data,
    })
      .then((res) => {
        setFormState("add");
        setSelectedItem({});
        setFormData({
          name: "",
          price: "",
          description: "",
        });
        setUpdated(!updated);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProduct();
  }, [updated]);

  return (
    <>
      <CustomHead title="Products" />
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>On Boarding Task</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <div className="d-flex justify-content-center mt-4">
          <h4 className="text-info fw-bold">List Product</h4>
        </div>
        <div className="content d-flex flex-wrap justify-content-center">
          {product?.length >= 0 &&
            product?.map((item, idx) => {
              return (
                <>
                  <div key={idx} className="m-2 " style={{ width: "400px" }}>
                    <Card className="content-card">
                      <Card.Header className="py-4">
                        <h5 className="fw-bold mb-3">{item.name}</h5>
                        <div
                          className="border-0 d-flex justify-content-center bg-primary"
                          style={{
                            width: "200px",
                            height: "24px",
                            borderRadius: "20px",
                          }}
                        >
                          <p className="text-white fw-bold">Rp. {item.price}</p>
                        </div>
                      </Card.Header>
                      <Card.Body className="">
                        <p className="fw-bold">Manfaat :</p>
                        {item.description.split("-").map((desc, idx) => {
                          return <li key={idx}>{desc}</li>;
                        })}
                      </Card.Body>
                      <div className="d-flex">
                        <Button
                          variant="danger"
                          className="m-3"
                          style={{ width: "150px" }}
                          onClick={() => {
                            deleteProduct(item.id);
                            setUpdated(!updated);
                          }}
                        >
                          Hapus
                        </Button>
                        <Button
                          variant="success"
                          className="m-3"
                          style={{ width: "150px" }}
                          onClick={() => {
                            setSelectedItem(item.id);
                            setFormState("edit");
                            setFormData({
                              ...formData,
                              name: item.name,
                              price: item.price,
                              description: item.description,
                            });
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </Card>
                  </div>
                </>
              );
            })}

          {product?.length === 0 && (
            <>
              <div className="text-center">
                <Image width="300px" height="300px" src="/no-data.png"></Image>
                <p>Data not found</p>
              </div>
            </>
          )}
        </div>

        <div className="mt-5">
          <h6 className="text-warning">Add Product</h6>
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              defaultValue={selectedItem?.name}
              value={formData.name}
              onChange={(v) =>
                setFormData({ ...formData, name: v.target.value })
              }
              type="text"
              placeholder="Enter Product name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Price</Form.Label>
            <Form.Control
              defaultValue={selectedItem?.price}
              value={formData.price}
              onChange={(v) =>
                setFormData({ ...formData, price: v.target.value })
              }
              type="text"
              placeholder="Enter Price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description Benefit</Form.Label>
            <Form.Control
              defaultValue={selectedItem?.desription}
              value={formData.description}
              onChange={(v) =>
                setFormData({ ...formData, description: v.target.value })
              }
              as="textarea"
              placeholder="Enter Benefit"
              rows={3}
            />
            <Form.Text className="text-muted">
              Separate with a dash (-) to express more than one benefit
            </Form.Text>
          </Form.Group>
          <Button
            onClick={(e) => {
              e.preventDefault();
              formState === "add"
                ? addProduct(formData)
                : updateProduct(selectedItem, formData);
            }}
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost:8000", {
    headers: {
      Origin: "http://localhost:3000",
    },
  });
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Home;
