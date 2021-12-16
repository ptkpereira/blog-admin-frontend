import {
  Box,
  Flex,
  Text,
  Heading,
  Container,
  Button,
  Spacer,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  CircularProgress,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import ReactPaginate from "react-paginate";

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const toast = useToast();
  const [idPostDelete, setIdPostDelete] = useState("");
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);
  const cancelRef = useRef();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await api("posts").then((res) => {
        setPosts(res.data);
        setLoading(false);
      });
    };

    getData();
  }, [reload]);

  const getPosts = async (e, page = 1) => {
    e && e.preventDefault();
    await api("posts", {
      params: { q: query, page },
    }).then((res) => setPosts(res.data));
  };

  const deletePost = async () => {
    await api
      .delete(`posts/${idPostDelete}`)
      .then(() => {
        toast({
          title: "Post deletado!",
          status: "success",
          duration: 3000,
        });
        setReload(!reload);
        onCloseAlert();
      })
      .catch((err) => {
        onCloseAlert();
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

  const handlePage = (e) => {
    getPosts(null, e.selected + 1);
  };

  return (
    <Layout>
      <Container maxW="container.xl" pt="50px">
        <Flex>
          <Heading>Listagem de Postagens</Heading>
          <Spacer />
          <Flex direction="column">
            <Link href={`/posts`}>
              <Button>Novo Post</Button>
            </Link>
            <form onSubmit={(e) => getPosts(e)}>
              <Flex mt="50px">
                <Input
                  placeholder="Pesquise pelo título"
                  mr="10px"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit">Buscar</Button>
              </Flex>
            </form>
          </Flex>
        </Flex>
        {loading ? (
          <Flex w="100%" justify="center" pt="50px">
            <CircularProgress isIndeterminate value={30} size="120px" />
          </Flex>
        ) : (
          <Flex pt="30px">
            {posts?.posts?.length > 0 ? (
              <Box w="100%">
                <Table variant="simple" mb="30px">
                  <Thead>
                    <Tr>
                      <Th>Título do post</Th>
                      <Th>Criador</Th>
                      <Th>Status</Th>
                      <Th>Data Atualização</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {posts?.posts?.map((post) => (
                      <Tr key={post.id}>
                        <Td>{post.title}</Td>
                        <Td>{post.user.name}</Td>
                        <Td>{post.status ? "Ativo" : "Inativo"}</Td>
                        <Td>
                          {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "short",
                          }).format(new Date(post.updatedAt))}
                        </Td>
                        <Td>
                          <Flex>
                            <Link href={`/posts?id=${post.id}`}>
                              <IconButton
                                colorScheme="blue"
                                aria-label="Editar"
                                icon={<EditIcon />}
                                mr="5px"
                              />
                            </Link>

                            <IconButton
                              colorScheme="red"
                              aria-label="Excluir"
                              icon={<DeleteIcon />}
                              onClick={() => {
                                setIdPostDelete(post.id);
                                setIsOpenAlert(true);
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {posts?.totalPages > 1 ? (
                  <Flex w="100%">
                    <Spacer />
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePage}
                      pageRangeDisplayed={5}
                      pageCount={posts.totalPages}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                      className="paginate"
                      pageClassName="paginate-item"
                      pageLinkClassName="paginate-link"
                      previousClassName="paginate-previous"
                      previousLinkClassName="paginate-link"
                      nextClassName="paginate-next"
                      nextLinkClassName="paginate-link"
                      activeClassName="active"
                    />
                  </Flex>
                ) : null}
              </Box>
            ) : (
              <Text>Nenhum post para exibir.</Text>
            )}
          </Flex>
        )}
        <AlertDialog
          isOpen={isOpenAlert}
          leastDestructiveRef={cancelRef}
          onClose={onCloseAlert}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Deletar post
              </AlertDialogHeader>

              <AlertDialogBody>Tem certeza?</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseAlert}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deletePost(isOpenAlert[1])}
                  ml={3}
                >
                  Deletar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Layout>
  );
};

export default Home;
