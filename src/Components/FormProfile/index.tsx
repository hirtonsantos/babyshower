import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { states } from "../../constants";
import { IUser } from "../../interfaces/user";
import { updateUserSchema } from "../../schemas/user/updateUser";
import { RootStore } from "../../Store";
import { CityType } from "../../Store/modules/cities/actionTypes";
import { getCitiesByStateThunk } from "../../Store/modules/cities/thunk";
import { updateParentById } from "../../Store/modules/profile/thunk";
import { StyledInput, StyledLabel, StyledStack } from "./style";

interface IDataUser {
  city: string;
  state: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  cpf: string;
}

interface FormProps {
  data: IDataUser;
  readOnly: boolean;
}

const FormProfile = ({ data, readOnly }: FormProps) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<Partial<IUser>>({ resolver: yupResolver(updateUserSchema) });

  const token = useSelector((state: RootStore): any => state.token);

  const handleUpdateProfile = (data: Partial<IUser>) => {
    dispatch(updateParentById(data, token.token));
  };

  const cities = useSelector((state: RootStore): any => state.cities).cities;

  const [currentState, setCurrentState] = useState(data?.state);
  const [currentCity, setCurrentCity] = useState(data?.city);

  const isCurrentCityInCities = (cities: CityType[]): boolean =>
    cities.some((city: CityType) => currentCity === city.city);

  useEffect(() => {
    if (cities.length > 0 && !isCurrentCityInCities(cities)) {
      setCurrentCity(cities[0].city);
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCitiesByStateThunk(currentState as string));
  }, [currentState]);

  return (
    <>
      <Grid
        container
        spacing={4}
        component="form"
        onSubmit={handleSubmit(handleUpdateProfile)}
        id="id-form-update-profile"
      >
        <Grid item>
          <Stack spacing={3}>
            <StyledStack>
              <StyledLabel>CPF</StyledLabel>
              <StyledInput
                readOnly={readOnly}
                disableUnderline
                defaultValue={data?.cpf}
                {...register("cpf")}
                error={!!errors.cpf}
              />
              <FormHelperText>{errors.cpf?.message}</FormHelperText>
            </StyledStack>
            <StyledStack>
              <StyledLabel>nome completo</StyledLabel>
              <StyledInput
                readOnly={readOnly}
                disableUnderline
                defaultValue={data?.name}
                {...register("name")}
                error={!!errors.name}
              />
              <FormHelperText>{errors.name?.message}</FormHelperText>
            </StyledStack>
            <StyledStack>
              <StyledLabel>username</StyledLabel>
              <StyledInput
                readOnly={readOnly}
                disableUnderline
                defaultValue={data?.username}
                {...register("username")}
                error={!!errors.username}
              />
              <FormHelperText>{errors.username?.message}</FormHelperText>
            </StyledStack>
            <StyledStack>
              <StyledLabel>email</StyledLabel>
              <StyledInput
                readOnly={readOnly}
                disableUnderline
                defaultValue={data?.email}
                {...register("email")}
                error={!!errors.email}
              />
              <FormHelperText>{errors.email?.message}</FormHelperText>
            </StyledStack>
          </Stack>
        </Grid>
        <Grid item>
          <Stack spacing={3}>
            <StyledStack>
              <StyledLabel>telefone</StyledLabel>
              <StyledInput
                placeholder="(XX) XXXXX-XXXX"
                readOnly={readOnly}
                disableUnderline
                defaultValue={data?.phone}
                {...register("phone")}
                error={!!errors.phone}
              />
              <FormHelperText>{errors.phone?.message}</FormHelperText>
            </StyledStack>
            <StyledStack>
              <StyledLabel>senha</StyledLabel>
              <StyledInput
                placeholder={readOnly ? "**********" : "Digite uma nova senha"}
                inputProps={{ type: "password", default: null }}
                readOnly={readOnly}
                disableUnderline
                {...register("password")}
                error={!!errors.password}
              />
              <FormHelperText>{errors.password?.message}</FormHelperText>
            </StyledStack>
            <StyledStack>
              <FormControl>
                <StyledLabel id="select-state-label">estado</StyledLabel>
                <Select
                  readOnly={readOnly}
                  labelId="select-state-label"
                  label="estado"
                  value={currentState}
                  id="select-state"
                  {...register("state")}
                  onChange={(e: SelectChangeEvent) => {
                    setCurrentState(e.target.value as string);
                  }}
                >
                  {states.map((item, idx) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </StyledStack>
            <StyledStack>
              <FormControl>
                <StyledLabel id="select-city-label">cidade</StyledLabel>
                <Select
                  readOnly={readOnly}
                  labelId="select-city-label"
                  label="city"
                  id="select-city"
                  value={currentCity}
                  {...register("city")}
                  onChange={(e: SelectChangeEvent) => {
                    setCurrentCity(e.target.value as string);
                  }}
                  error={!!errors.city}
                >
                  {cities.length > 0 && isCurrentCityInCities(cities) ? (
                    cities.map(({ point_id, city }: any) => (
                      <MenuItem key={point_id} value={city}>
                        {city}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={currentCity}>{currentCity}</MenuItem>
                  )}
                </Select>
                <FormHelperText>{errors.city?.message}</FormHelperText>
              </FormControl>
            </StyledStack>
          </Stack>
        </Grid>
      </Grid>
      <Toaster />
    </>
  );
};

export default memo(FormProfile);
