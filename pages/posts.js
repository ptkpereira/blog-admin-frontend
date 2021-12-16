import {
  Box,
  Flex,
  Text,
  Heading,
  Container,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Spacer,
  Textarea,
  IconButton,
  useDisclosure,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useRouter } from "next/router";

const Posts = () => {
  const Router = useRouter();
  const { id } = Router.query;
  const toast = useToast();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedInput, setRelatedInput] = useState("");
  const [options, setOptions] = useState([
    { title: "Primeiro Post" },
    { title: "Segundo Post talvez" },
  ]);
  const [status, setStatus] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getData = async () => {
      await api(`posts/${id}`).then((res) => {
        setPost(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setImage(res.data.image);
        setStatus(res.data.status ? "ativo" : "inativo");
        if (res.data.relatedPosts.length > 0) {
          const includes = [];
          res.data.relatedPosts.map((related) => includes.push(related.post));
          setRelatedPosts(includes);
        }
      });
    };

    id && getData();
  }, [id, reload]);

  useEffect(() => {
    const getRelatedPosts = async () => {
      await api
        .get("posts", {
          params: { q: relatedInput },
        })
        .then((res) => setOptions(res.data.posts));
    };

    if (relatedInput.length > 0) {
      getRelatedPosts();
    }
  }, [relatedInput]);

  const updatePost = async (e) => {
    e.preventDefault();
    console.log("status ", status);
    setLoading(true);
    await api
      .put(`posts/${id}`, {
        title,
        description,
        image,
        status: status === "ativo",
        relatedPosts,
      })
      .then(() => {
        toast({
          title: "Post atualizado!",
          status: "success",
          duration: 3000,
        });
        setLoading(false);
        setReload(!reload);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Houve um erro",
          status: "error",
          duration: 3000,
        });
        if (err.response) {
          console.log(err.response.data.error);
        } else {
          console.log("Ocorreu um erro. Tente novamente, por favor.");
        }
      });
  };

  const addPost = async (e) => {
    e.preventDefault();
    setLoading(false);
    const relatedPostsId = relatedPosts.map((related) => related.id);

    await api
      .post(`posts`, {
        user_id: 1,
        title,
        description,
        image,
        status: status === "ativo",
        related_posts: relatedPostsId,
      })
      .then(() => {
        toast({
          title: "Post criado!",
          status: "success",
          duration: 3000,
        });
        setLoading(false);
        Router.push("/");
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Houve um erro",
          status: "error",
          duration: 3000,
        });
        if (err.response) {
          console.log(err.response.data.error);
        } else {
          console.log("Ocorreu um erro. Tente novamente, por favor.");
        }
      });
  };

  const addRelatedPost = (postInclude) => {
    if (!relatedPosts.includes(postInclude)) {
      setRelatedPosts((prev) => [...prev, postInclude]);
    }
  };

  const removeRelatedPost = (postRemove) => {
    setRelatedPosts(relatedPosts.filter((item) => item !== postRemove));
  };

  return (
    <Layout>
      <Box onClick={onClose}>
        <Container maxW="container.xl" pt="50px">
          <Heading>Cadastro/Edição Postagens</Heading>
          <form
            autoComplete="off"
            onSubmit={(e) => (post ? updatePost(e) : addPost(e))}
          >
            <Flex direction="column" mt="50px">
              <FormControl mb="50px" id="titulo">
                <Flex align="center">
                  <FormLabel fontSize="1.1rem" w="200px">
                    Título
                  </FormLabel>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Flex>
              </FormControl>
              <FormControl mb="50px" id="descricao">
                <Flex align="center">
                  <FormLabel fontSize="1.1rem" w="200px">
                    Descrição
                  </FormLabel>
                  <Textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Flex>
              </FormControl>
              <FormControl mb="50px" id="imagem">
                <Flex align="center">
                  <FormLabel fontSize="1.1rem" w="200px">
                    Imagem Capa
                  </FormLabel>
                  <Input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </Flex>
              </FormControl>
              <FormControl mb="50px" id="related-posts">
                <Flex align="start">
                  <FormLabel fontSize="1.1rem" w="200px">
                    Posts Relacionados
                  </FormLabel>
                  <Box w="100%">
                    <Input
                      type="text"
                      value={relatedInput}
                      onChange={(e) => {
                        onOpen();
                        setRelatedInput(e.target.value);
                      }}
                    />

                    <Box
                      bg="gray.600"
                      p="15px"
                      borderRadius="4px"
                      mt="2px"
                      mb="5px"
                      display={
                        isOpen && relatedInput.length > 0 && options.length > 0
                          ? "Block"
                          : "none"
                      }
                    >
                      {options.map((option) => {
                        return relatedPosts.some((e) => e.id === option.id) ? (
                          <Box key={option.id} py="5px">
                            <Text color="gray.500">
                              <s>{option.title}</s>
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            key={option.id}
                            cursor="pointer"
                            py="5px"
                            onClick={() => addRelatedPost(option)}
                          >
                            <Text>{option.title}</Text>
                          </Box>
                        );
                      })}
                    </Box>
                    <Flex mt="10px">
                      {relatedPosts.length > 0 &&
                        relatedPosts.map((related) => (
                          <Flex
                            mx="4px"
                            align="center"
                            bg="gray.700"
                            borderRadius="5px"
                            py="5px"
                            px="7px"
                          >
                            <Text mr="5px">{related.title}</Text>
                            <DeleteIcon
                              color="red"
                              cursor="pointer"
                              onClick={() => removeRelatedPost(related)}
                            />
                          </Flex>
                        ))}
                    </Flex>
                  </Box>
                </Flex>
              </FormControl>
              <FormControl mb="50px" id="imagem">
                <Flex align="center">
                  <FormLabel fontSize="1.1rem" w="170px">
                    Status
                  </FormLabel>
                  <Select w="250px" onChange={(e) => setStatus(e.target.value)}>
                    <option selected={status === "ativo"} value="ativo">
                      Ativo
                    </option>
                    <option selected={status === "inativo"} value="inativo">
                      Inativo
                    </option>
                  </Select>
                </Flex>
              </FormControl>
              <Flex mt="50px" w="100%">
                <Spacer />
                <Button size="lg" type="submit">
                  {loading ? (
                    <CircularProgress isIndeterminate value={30} size="30px" />
                  ) : (
                    "Gravar"
                  )}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Container>
      </Box>
    </Layout>
  );
};

export default Posts;
