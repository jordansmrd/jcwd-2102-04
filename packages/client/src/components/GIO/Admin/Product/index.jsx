import React, { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Avatar,
  AvatarGroup,
  Text,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Link,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  FormControl,
  useToast,
  TableContainer,
  TableCaption,
  Tfoot,
  Image as Img,
  HStack,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiCreditCard,
  FiSearch,
  FiBell,
  FiGrid,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";
import { EditIcon } from "@chakra-ui/icons";
// import MyChart from "../../../components/Chart/index";

// import Logo from "../../../public/NavbarLogoPink.gif";
// import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import jsCoockie from "js-cookie";
import { useRouter } from "next/router";
import auth_types from "../../../../redux/reducers/types/auth";
import M_editProduct from "../../modals/M_editProduct";
import M_deleteProduct from "../../modals/M_deleteProduct";
import M_addProduct from "../../modals/M_addProduct";
import * as moment from "moment";
import { axiosInstance } from "../../../../library/api";

export default function NavbarA() {
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  const userSelector = useSelector((state) => {
    return state.auth;
  });

  const autoRender = useSelector((state) => {
    return state.post;
  });

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    jsCoockie.remove("auth_token");

    dispatch({
      type: auth_types.AUTH_LOGOUT,
    });
    setIsLoading(true);
    router.push("/auth");
  };

  useEffect(() => {
    setIsLoading(false);
  }, [autoRender]);

  // const current = new Date();
  // const date = `${current.getDate()}/${
  //   current.getMonth() + 1
  // }/${current.getFullYear()}`;
  const date = moment(new Date()).format("LLLL");

  const [loadPage, setLoadPage] = useState(1);
  const [contentList, setContentList] = useState([]);
  console.log(contentList)

  const fetchData = async () => {
    alert("aaa")
    await axiosInstance.get("/product", {params : {
      limit : 20,
      page: 1,
    }})
      .then((res) => {
        const data = res.data.result;
        console.log(data);
        setContentList(res.data.result);
      })
      .catch((err) => { 
        console.log(err)
      });
  };

  useEffect(() => {
    if (autoRender?.value !== undefined) {
      setLoadPage(loadPage);
      fetchData();
      console.log(contentList);
    }
  }, [autoRender?.value]);

  const renderCategory = () => {
    return contentList.map((val, index) => {
      return (
        <Tr key={index}>
          <Td>{val.product_code}</Td>
          <Td>{val.product_name}</Td>
          <Td>PRICE</Td>
          <Td>
            {
              val.product_categories.map((val, index) => {
                return (
                  <Text mb={2} key={index}>
                    {val.category.category}
                  </Text>
                )
              })
            }
          </Td>
          <Td>
            <Img
              src={`http://${val.product_imgs[0].img_url}`}
              width={"90px"}
              height={"50px"}
            />
          </Td>
          <Td>{val.product_stocks[0].main_unit}</Td>
          <Td>
            <Flex justify="center">
              <M_editProduct key={index} id={val.id} />
              <M_deleteProduct key={index} id={val.id} />
            </Flex>
          </Td>
        </Tr>
      );
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex
      h={[null, null, "100vh"]}
      maxW="2000px"
      flexDir={["column", "column", "row"]}
      overflow="hidden"
    >
      {/* Column 1 */}

      {/* --------------Column 2------------- */}
      <Flex
        w={["100%", "100%", "60%", "60%", "55%"]}
        p="2%"
        flexDir="column"
        overflow="auto"
        minH="100vh"
        minW="full"
      >
        {/* -------------CATEGORY------------ */}

        {/* ------------PRODUCT DATA--------- */}

        <Flex justifyContent="space-between" mt={8}>
          <Flex align="flex-end">
            <Heading as="h2" size="lg" letterSpacing="tight">
              PRODUCT DATA
            </Heading>
            {/* <Text fontSize="small" color="gray" ml={4}>
              Apr 2021
            </Text> */}
          </Flex>

          <FormControl alignItems={"center"} maxW={"30%"}>
            {/* <Input type={"text"} placeholder={"Search...."} bgColor={"white"} /> */}

            <InputGroup
              bgColor="#fff"
              // mb={4}
              border="none"
              borderColor="gray"
              borderRadius="10px"
              mr={2}
            >
              <InputLeftElement
                pointerEvents="none"
              >
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input type="number" placeholder="Search" borderRadius="10px" />
            </InputGroup>
          </FormControl>

          <Flex justifyContent={"flex-end"}>
            <Link href="/home">
              <Icon as={FiHome} fontSize="4xl" mr="5" />
            </Link>
            <M_addProduct />
          </Flex>
        </Flex>
        <Flex flexDir="column">
          <Flex overflow="auto">
            <Table variant="unstyled" mt={4}>
              <Thead>
                <Tr>
                  <Th  fontSize={14} fontWeight='bold'>Code</Th>
                  <Th  fontSize={14} fontWeight='bold'>Name</Th>
                  <Th  fontSize={14} fontWeight='bold'>Price</Th>
                  <Th  fontSize={14} fontWeight='bold'>Category</Th>
                  <Th  fontSize={14} fontWeight='bold'>Picture</Th>
                  <Th  fontSize={14} fontWeight='bold'>Main Unit</Th>
                  <Th  fontSize={14} fontWeight='bold' textAlign='center'>Setting</Th>
                </Tr>
              </Thead>
              <Tbody>{renderCategory()}</Tbody>
            </Table>
          </Flex>
          <Flex align="center">
            <Divider />
            <IconButton
              icon={display == "show" ? <FiChevronUp /> : <FiChevronDown />}
              onClick={() => {
                if (display == "show") {
                  changeDisplay("none");
                } else {
                  changeDisplay("show");
                }
              }}
            />
            <Divider />
          </Flex>
        </Flex>
      </Flex>

      {/* --------------Column 3------------ */}
    </Flex>
  );
}
