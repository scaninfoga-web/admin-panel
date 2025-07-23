"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { get, post } from "@/lib/api";
import type { LocationInformationProps } from "@/lib/types";
import { Loader } from "./custom-loader";

interface PropsUtil {
  data: LocationInformationProps | undefined;
  loading: boolean;
}

export interface userLocation {
  responseStatus: {
    status: boolean;
    message: string;
  };
  responseData: {
    content_type: string;
    image: string;
  };
}


export const LocationInformation: React.FC<PropsUtil> = ({ data, loading }) => {
  const [locationData, setLocationData] = useState<userLocation | null>();

  const populateMapImg = async () => {
    try {
      if (locationData) return;
      const imageData = await post("/api/auth/getlocation", {
        longitude: data?.longitude,
        latitude: data?.latitude,
      });
      setLocationData(imageData)
    } catch (error) {
      toast.error("Error getting maps data.");
    } finally {
      // setMapLoading(false);
    }
  };

  useEffect(() => {
    if(data?.latitude && data?.longitude){
      populateMapImg()
    }
  }, [data?.latitude, data?.longitude])

  if (loading || !data) {
    return (
      <Card>
        <Loader />
      </Card>
    );
  }

  return (
    <Card className="card-bg border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-500">
          <MapPin className="h-5 w-5 text-emerald-500" />
          Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Latitude:</h3>
            <p className="text-gray-300">{data.latitude}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Longitude:</h3>
            <p className="text-gray-300">{data.longitude}</p>
          </div>
          {/* <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Device</h3>
            <p className="text-gray-300">{locationData?.device}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Browser:</h3>
            <p className="text-gray-300">{locationData?.browser}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">IP Address:</h3>
            <p className="text-gray-300">{locationData?.ipAddress}</p>
          </div> */}
        </div>
        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800">
          {loading ? (
            <Loader />
          ) : locationData ? (
            <Image
              src={`data:${locationData?.responseData?.content_type};base64,${locationData?.responseData?.image}`}
              alt="map"
              width={600}
              height={500}
              className="max-h-64 w-full rounded-xl"
              unoptimized={true}
            />
          ) : (
            <div className="text-center text-slate-400">
              <MapPin className="mx-auto mb-2 h-12 w-12 text-emerald-500" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">
                Map visualization will be displayed here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
